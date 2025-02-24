import psutil
import time
import json
from datetime import datetime
import win32gui
import win32process
import os
from pathlib import Path
import win32api
import win32con
import math
from threading import Thread
import keyboard
import mouse
import colorama
from colorama import Fore, Style
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Initialize colorama for colored terminal output
colorama.init()

class MetricsCollector:
    def __init__(self):
        self.data_dir = Path("data")
        self.data_dir.mkdir(exist_ok=True)
        self.metrics_file = self.data_dir / "metrics.json"
        self.load_existing_data()
        
        # For tracking changes to log
        self.last_metrics = {
            "mouse_clicks": self.metrics["mouse_clicks"].copy(),
            "keypresses": self.metrics["keypresses"],
            "mouse_movement": self.metrics["mouse_movement"]
        }
        
        # For tracking active window time
        self.active_window_times = {}
        self.last_active_window = None
        self.last_window_time = time.time()
        
        # Start metrics collection in a separate thread
        self.running = True
        self.collection_thread = Thread(target=self.metrics_loop)
        self.collection_thread.daemon = True
        self.collection_thread.start()
        
        # Set up mouse and keyboard tracking
        self.setup_tracking()
        
        # Track mouse movement
        self.last_pos = win32api.GetCursorPos()
        self.movement_thread = Thread(target=self.track_movement)
        self.movement_thread.daemon = True
        self.movement_thread.start()
        
        # Start logging thread
        self.log_thread = Thread(target=self.log_metrics)
        self.log_thread.daemon = True
        self.log_thread.start()
        
        # Start active window tracking thread
        self.window_thread = Thread(target=self.track_active_window)
        self.window_thread.daemon = True
        self.window_thread.start()
        
        # Initialize Firebase (only if not already initialized)
        if not firebase_admin._apps:
            # You'll need to download this file from Firebase console
            cred = credentials.Certificate("firebase-key.json")
            firebase_admin.initialize_app(cred)
        
        self.db = firestore.client()
        
        print(f"{Fore.GREEN}Metrics collector initialized{Style.RESET_ALL}")
        print(f"Data will be saved to: {self.metrics_file}")

    def setup_tracking(self):
        # Set up mouse click tracking
        mouse.on_click(lambda: self.increment_clicks("left"))
        mouse.on_right_click(lambda: self.increment_clicks("right"))
        mouse.on_middle_click(lambda: self.increment_clicks("middle"))
        
        # Set up keyboard tracking
        keyboard.on_press(lambda _: self.increment_keypresses())
    
    def increment_clicks(self, button):
        self.metrics["mouse_clicks"][button] += 1
        print(f"{Fore.CYAN}Click detected: {button}{Style.RESET_ALL}")
        
    def increment_keypresses(self):
        self.metrics["keypresses"] += 1
        
    def log_metrics(self):
        """Log metrics changes periodically"""
        while self.running:
            # Calculate changes since last log
            left_clicks = self.metrics["mouse_clicks"]["left"] - self.last_metrics["mouse_clicks"]["left"]
            right_clicks = self.metrics["mouse_clicks"]["right"] - self.last_metrics["mouse_clicks"]["right"]
            middle_clicks = self.metrics["mouse_clicks"]["middle"] - self.last_metrics["mouse_clicks"]["middle"]
            keypresses = self.metrics["keypresses"] - self.last_metrics["keypresses"]
            movement = self.metrics["mouse_movement"] - self.last_metrics["mouse_movement"]
            
            # Only log if there are changes
            if left_clicks > 0 or right_clicks > 0 or middle_clicks > 0 or keypresses > 0 or movement > 0.1:
                print(f"\n{Fore.YELLOW}Metrics update:{Style.RESET_ALL}")
                print(f"Left clicks: +{left_clicks} (Total: {self.metrics['mouse_clicks']['left']})")
                print(f"Right clicks: +{right_clicks} (Total: {self.metrics['mouse_clicks']['right']})")
                print(f"Middle clicks: +{middle_clicks} (Total: {self.metrics['mouse_clicks']['middle']})")
                print(f"Keypresses: +{keypresses} (Total: {self.metrics['keypresses']})")
                print(f"Mouse movement: +{movement:.2f} feet (Total: {self.metrics['mouse_movement']:.2f} feet)")
                
                # Update last metrics
                self.last_metrics = {
                    "mouse_clicks": self.metrics["mouse_clicks"].copy(),
                    "keypresses": self.metrics["keypresses"],
                    "mouse_movement": self.metrics["mouse_movement"]
                }
                
                # Save metrics to ensure data is not lost
                self.save_metrics()
                
            time.sleep(10)  # Log every 10 seconds
    
    def track_movement(self):
        """Track mouse movement in a separate thread"""
        while self.running:
            current_pos = win32api.GetCursorPos()
            if current_pos != self.last_pos:
                dx = current_pos[0] - self.last_pos[0]
                dy = current_pos[1] - self.last_pos[1]
                distance = math.sqrt(dx*dx + dy*dy)
                # Convert pixels to inches, then to feet
                feet_moved = (distance / 96) / 12
                self.metrics["mouse_movement"] += feet_moved
                self.last_pos = current_pos
            time.sleep(0.05)  # 50ms polling interval

    def metrics_loop(self):
        """Collect app usage metrics and save data periodically"""
        while self.running:
            try:
                print(f"\n{Fore.GREEN}Collecting hourly metrics...{Style.RESET_ALL}")
                self.collect_metrics()
                print(f"{Fore.GREEN}Hourly metrics collected and saved.{Style.RESET_ALL}")
                
                # Save metrics every 5 minutes to avoid data loss
                for i in range(12):  # 12 x 5 minutes = 1 hour
                    if not self.running:
                        break
                    time.sleep(300)  # 5 minutes
                    self.save_metrics()
                    print(f"{Fore.BLUE}Metrics saved (checkpoint {i+1}/12){Style.RESET_ALL}")
            except Exception as e:
                print(f"{Fore.RED}Error in metrics loop: {e}{Style.RESET_ALL}")

    def load_existing_data(self):
        if self.metrics_file.exists():
            with open(self.metrics_file, 'r') as f:
                self.metrics = json.load(f)
        else:
            self.metrics = {
                "mouse_clicks": {"left": 0, "right": 0, "middle": 0},
                "keypresses": 0,
                "mouse_movement": 0,  # in feet
                "app_usage": {},
                "hourly_data": []
            }

    def get_active_window_process(self):
        try:
            window = win32gui.GetForegroundWindow()
            _, pid = win32process.GetWindowThreadProcessId(window)
            process = psutil.Process(pid)
            return process.name()
        except:
            return "unknown"

    def track_active_window(self):
        """Track time spent in each active window"""
        while self.running:
            try:
                current_window = self.get_active_window_process()
                current_time = time.time()
                
                # If window changed, update times
                if current_window != self.last_active_window and self.last_active_window is not None:
                    time_spent = current_time - self.last_window_time
                    
                    # Only count if more than 1 second was spent in the window
                    if time_spent > 1:
                        if self.last_active_window in self.active_window_times:
                            self.active_window_times[self.last_active_window] += time_spent
                        else:
                            self.active_window_times[self.last_active_window] = time_spent
                        
                        # Log window change if significant time was spent
                        if time_spent > 5:
                            print(f"{Fore.CYAN}Window change: {self.last_active_window} → {current_window} "
                                  f"(spent {time_spent:.1f}s){Style.RESET_ALL}")
                
                # Update current window
                self.last_active_window = current_window
                self.last_window_time = current_time
                
                time.sleep(1)  # Check every second
            except Exception as e:
                print(f"{Fore.RED}Error tracking active window: {e}{Style.RESET_ALL}")

    def collect_metrics(self):
        """Collect app usage metrics and save hourly data"""
        try:
            # Get active window information
            active_window = self.get_active_window_process()
            
            # System processes to filter out
            system_processes = [
                'memcompression',
                'system',
                'registry',
                'smss.exe',
                'csrss.exe',
                'wininit.exe',
                'services.exe',
                'lsass.exe',
                'svchost.exe',
                'dwm.exe',
                'ntoskrnl.exe',
                'winlogon.exe',
                'taskmgr.exe',
                'conhost.exe',
                'runtimebroker.exe',
                'searchindexer.exe',
                'searchui.exe',
                'shellexperiencehost.exe',
                'sihost.exe',
                'startmenuexperiencehost.exe'
            ]
            
            # Use active window times for app usage
            active_apps = {}
            for app, seconds in self.active_window_times.items():
                # Skip system processes
                if app.lower() in system_processes:
                    continue
                    
                # Convert seconds to minutes
                minutes = seconds / 60
                active_apps[app] = minutes
            
            # Reset active window times for next hour
            self.active_window_times = {}
            
            # Get top 6 apps by active time
            top_apps = dict(sorted(active_apps.items(), 
                                 key=lambda x: x[1], 
                                 reverse=True)[:6])
                                 
            # Print the top apps for debugging
            print(f"\n{Fore.MAGENTA}Top active applications (minutes):{Style.RESET_ALL}")
            for app, minutes in top_apps.items():
                print(f"  {app}: {minutes:.1f} min")

            timestamp = datetime.now().isoformat()
            hourly_data = {
                "timestamp": timestamp,
                "mouse_clicks": self.metrics["mouse_clicks"].copy(),
                "keypresses": self.metrics["keypresses"],
                "mouse_movement": self.metrics["mouse_movement"],
                "top_apps": top_apps
            }

            self.metrics["hourly_data"].append(hourly_data)
            self.save_metrics()
            
        except Exception as e:
            print(f"{Fore.RED}Error collecting metrics: {e}{Style.RESET_ALL}")

    def save_metrics(self):
        # Save locally as before
        with open(self.metrics_file, 'w') as f:
            json.dump(self.metrics, f, indent=2)
        
        # Also save to Firebase
        try:
            # Create a copy of metrics without hourly_data
            metrics_to_upload = {k: v for k, v in self.metrics.items() if k != 'hourly_data'}
            
            # Upload main metrics
            self.db.collection('metrics').document('current').set(metrics_to_upload)
            
            # If we have new hourly data to upload
            if self.metrics.get('hourly_data'):
                # Get the latest hourly data entry
                latest_entry = self.metrics['hourly_data'][-1]
                
                # Create a document ID based on timestamp
                doc_id = latest_entry['timestamp'].replace(':', '-').replace('.', '-')
                
                # Upload as a document in the hourly_data subcollection
                hourly_ref = self.db.collection('metrics').document('current').collection('hourly_data')
                hourly_ref.document(doc_id).set(latest_entry)
            
            print(f"{Fore.BLUE}Metrics synced to Firebase{Style.RESET_ALL}")
        except Exception as e:
            print(f"{Fore.RED}Error syncing to Firebase: {e}{Style.RESET_ALL}")
        
    def cleanup(self):
        self.running = False
        self.save_metrics()
        print(f"{Fore.GREEN}Metrics saved.{Style.RESET_ALL}")
        print(f"{Fore.GREEN}Final metrics:{Style.RESET_ALL}")
        print(f"Left clicks: {self.metrics['mouse_clicks']['left']}")
        print(f"Right clicks: {self.metrics['mouse_clicks']['right']}")
        print(f"Middle clicks: {self.metrics['mouse_clicks']['middle']}")
        print(f"Keypresses: {self.metrics['keypresses']}")
        print(f"Mouse movement: {self.metrics['mouse_movement']:.2f} feet")

def main():
    collector = MetricsCollector()
    try:
        print(f"{Fore.GREEN}Collector running. Press Ctrl+C to stop.{Style.RESET_ALL}")
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print(f"\n{Fore.YELLOW}Stopping collector...{Style.RESET_ALL}")
        collector.cleanup()
        print(f"{Fore.GREEN}Collector stopped.{Style.RESET_ALL}")

if __name__ == "__main__":
    main() 