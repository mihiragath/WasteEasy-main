"use client";

import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, Navigation, AlertTriangle, Package, Clock, Settings, FileText, Bell } from "lucide-react";

const DriverPanel = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [tasks, setTasks] = useState([
        {
            id: 1,
            lat: 51.505,
            lng: -0.09,
            status: "pending",
            location: "123 Main St",
            fillLevel: 85,
            type: "General Waste",
            priority: "High",
            estimatedTime: "10 mins",
        },
        {
            id: 2,
            lat: 51.51,
            lng: -0.1,
            status: "completed",
            location: "456 Oak Ave",
            fillLevel: 90,
            type: "Recyclables",
            priority: "Medium",
            estimatedTime: "15 mins",
        },
    ]);

    const [routeStats] = useState({
        completed: 5,
        remaining: 3,
        distance: "15.5 km",
        estimatedTime: "2.5 hours",
        fuelEfficiency: "8.5 L/100km",
        totalWeight: "2.8 tons",
    });

    const [notifications] = useState([
        { id: 1, message: "New high-priority bin added to route", time: "5 mins ago", type: "alert" },
        { id: 2, message: "Route optimization completed", time: "30 mins ago", type: "success" },
        { id: 3, message: "Vehicle maintenance due in 2 days", time: "1 hour ago", type: "warning" },
    ]);

    const [vehicleStats] = useState({
        fuelLevel: 75,
        temperature: 28,
        engineHealth: 95,
        nextService: "500 km",
    });

    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initMap = () => {
            if (mapRef.current && window.google) {
                const map = new window.google.maps.Map(mapRef.current, {
                    center: { lat: 51.505, lng: -0.09 },
                    zoom: 13,
                });
                tasks.forEach((task) => {
                    new window.google.maps.Marker({
                        position: { lat: task.lat, lng: task.lng },
                        map,
                        title: `Task #${task.id}`,
                    });
                });
            }
        };

        if (!window.google) {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`;
            script.async = true;
            script.defer = true;
            script.onload = initMap;
            document.head.appendChild(script);
        } else {
            initMap();
        }
    }, [tasks]);

    const handleTaskComplete = async (taskId: number) => {
        try {
            setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: "completed" } : task)));
        } catch (error) {
            alert("Error updating task status");
        }
    };

    return (
        <div className="p-6">
            {/* Navigation Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab("dashboard")} className={`${activeTab === "dashboard" ? "border-emerald-500 text-emerald-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}>
                        <FileText className="h-5 w-5 mr-2" />
                        Dashboard
                    </button>
                    <button onClick={() => setActiveTab("notifications")} className={`${activeTab === "notifications" ? "border-emerald-500 text-emerald-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}>
                        <Bell className="h-5 w-5 mr-2" />
                        Notifications
                    </button>
                    <button onClick={() => setActiveTab("vehicle")} className={`${activeTab === "vehicle" ? "border-emerald-500 text-emerald-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}>
                        <Settings className="h-5 w-5 mr-2" />
                        Vehicle Status
                    </button>
                </nav>
            </div>

            {activeTab === "dashboard" && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard icon={<CheckCircle className="h-8 w-8 text-emerald-600" />} title="Completed Tasks" value={routeStats.completed} subtitle="Today's collections" />
                        <StatCard icon={<Package className="h-8 w-8 text-emerald-600" />} title="Remaining Tasks" value={routeStats.remaining} subtitle="Pending collections" />
                        <StatCard icon={<Navigation className="h-8 w-8 text-emerald-600" />} title="Total Distance" value={routeStats.distance} subtitle="Route length" />
                        <StatCard icon={<Clock className="h-8 w-8 text-emerald-600" />} title="Est. Time Remaining" value={routeStats.estimatedTime} subtitle="To completion" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4">Route Navigation</h2>
                            <div ref={mapRef} className="h-[500px] rounded-lg overflow-hidden"></div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4">Collection Tasks</h2>
                            <div className="space-y-4">
                                {tasks.map((task) => (
                                    <TaskCard key={task.id} task={task} onComplete={() => handleTaskComplete(task.id)} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4">Route Statistics</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500">Fuel Efficiency</h3>
                                    <p className="mt-1 text-lg font-semibold">{routeStats.fuelEfficiency}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500">Total Weight Collected</h3>
                                    <p className="mt-1 text-lg font-semibold">{routeStats.totalWeight}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="p-4 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition">Start Break</button>
                                <button className="p-4 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition">Report Issue</button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeTab === "notifications" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Notifications</h2>
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <div key={notification.id} className={`p-4 rounded-lg ${notification.type === "alert" ? "bg-red-50" : notification.type === "warning" ? "bg-yellow-50" : "bg-green-50"}`}>
                                <div className="flex justify-between items-center">
                                    <span className={`${notification.type === "alert" ? "text-red-800" : notification.type === "warning" ? "text-yellow-800" : "text-green-800"}`}>{notification.message}</span>
                                    <span className="text-sm text-gray-500">{notification.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === "vehicle" && (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-6">Vehicle Status</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Fuel Level</h3>
                                <div className="mt-2">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-lg font-semibold">{vehicleStats.fuelLevel}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${vehicleStats.fuelLevel}%` }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Temperature</h3>
                                <p className="mt-2 text-lg font-semibold">{vehicleStats.temperature}°C</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Engine Health</h3>
                                <p className="mt-2 text-lg font-semibold">{vehicleStats.engineHealth}%</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Next Service</h3>
                                <p className="mt-2 text-lg font-semibold">{vehicleStats.nextService}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Maintenance History</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-03-01</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Oil Change</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">John Smith</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-02-15</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Brake Inspection</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mike Johnson</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Report Issue</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Issue Type</label>
                                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500">
                                    <option>Select issue type</option>
                                    <option>Mechanical</option>
                                    <option>Electrical</option>
                                    <option>Hydraulic</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" placeholder="Describe the issue..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Priority</label>
                                <div className="mt-2 space-x-4">
                                    <label className="inline-flex items-center">
                                        <input type="radio" name="priority" value="low" className="form-radio text-emerald-600" />
                                        <span className="ml-2">Low</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input type="radio" name="priority" value="medium" className="form-radio text-emerald-600" />
                                        <span className="ml-2">Medium</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input type="radio" name="priority" value="high" className="form-radio text-emerald-600" />
                                        <span className="ml-2">High</span>
                                    </label>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition">
                                Submit Report
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="mt-8">
                <button className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 mr-2" />
                    Report Emergency
                </button>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, subtitle }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
            <div className="flex-shrink-0">{icon}</div>
            <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                <p className="text-2xl font-semibold text-emerald-600">{value}</p>
                <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
        </div>
    </div>
);

const TaskCard = ({ task, onComplete }) => (
    <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between">
            <div>
                <h3 className="font-medium">Bin #{task.id}</h3>
                <p className="text-sm text-gray-500">{task.location}</p>
                <p className="text-sm text-gray-600">Fill Level: {task.fillLevel}%</p>
                <p className="text-sm text-gray-600">Type: {task.type}</p>
                <div className="mt-2 flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${task.priority === "High" ? "bg-red-100 text-red-800" : task.priority === "Medium" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>{task.priority}</span>
                    <span className="ml-2 text-sm text-gray-500">ETA: {task.estimatedTime}</span>
                </div>
            </div>
            <button onClick={onComplete} disabled={task.status === "completed"} className={`px-4 py-2 rounded-md ${task.status === "completed" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-700"} transition`}>
                {task.status === "completed" ? "Completed" : "Mark Complete"}
            </button>
        </div>
    </div>
);

export default DriverPanel;
