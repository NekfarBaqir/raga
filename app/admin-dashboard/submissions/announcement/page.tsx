// "use client";

// import { useState } from "react";
// import { SendHorizonalIcon, Sparkles, Trash2 } from "lucide-react";
// import { announcementsData } from "./announcementsData";
// export default function AnnouncementsPage() {
//     const [subject, setSubject] = useState("");
//     const [message, setMessage] = useState("");
//     const [announcements, setAnnouncements] = useState<
//         { id: number; subject: string; text: string; recipients: string[] }[]
//     >([]);
//     const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

//     const toggleStatus = (status: string) => {
//         setSelectedStatuses((prev) =>
//             prev.includes(status)
//                 ? prev.filter((s) => s !== status)
//                 : [...prev, status]
//         );
//     };

//     const handleSend = () => {
//         if (!message.trim() || !subject.trim() || selectedStatuses.length === 0) return;

//         const newAnnouncement = {
//             id: Date.now(),
//             subject,
//             text: message,
//             recipients: selectedStatuses,
//         };

//         console.log("📤 Sending announcement:", newAnnouncement);

//         setAnnouncements([...announcements, newAnnouncement]);
//         setSubject("");
//         setMessage("");
//         setSelectedStatuses([]);
//     };

//     const handleClear = () => {
//         setSubject("");
//         setMessage("");
//     };

//     const counts = {
//         Pending: announcementsData.filter((a) => a.status === "Pending").length,
//         Approved: announcementsData.filter((a) => a.status === "Approved").length,
//         Rejected: announcementsData.filter((a) => a.status === "Rejected").length,
//     };

//     return (
//         <div className="flex flex-col gap-6 p-6">
//             <div className="text-center mb-8">
//                 <h1 className="text-lg md:text-3xl md:font-bold">Create an Announcement</h1>
//                 <p className="text-xs mt-3">
//                     Draft and send important updates to applicants by status.
//                 </p>
//             </div>
//             <h1 className="ml-2 font-semibold">Select the  Status</h1>
//             <div className="flex gap-3">
//                 {["Pending", "Approved", "Rejected"].map((status) => (
//                     <div key={status} className="flex items-center gap-2">
//                         <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-transparent border text-base text-primary font-bold p-5">
//                             {counts[status as keyof typeof counts]}
//                         </span>

//                         <button
//                             onClick={() => toggleStatus(status)}
//                             className={`px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer flex items-center gap-2
//                                         ${selectedStatuses.includes(status) ? "bg-primary text-white" : "hover:bg-accent"}`}
//                         >
//                             {status}
//                         </button>
//                     </div>
//                 ))}
//             </div>


//             <div className="flex flex-col gap-2 max-w-[500px]">
//                 <label className="text-sm md:text-base ml-2 font-medium">Subject</label>
//                 <input
//                     type="text"
//                     value={subject}
//                     onChange={(e) => setSubject(e.target.value)}
//                     placeholder="Enter the subject..."
//                     className="w-full rounded-lg border px-6 py-4 text-xs focus:outline-none"
//                 />
//             </div>

//             <div className="flex flex-col gap-2">
//                 <label className="text-sm md:text-base font-medium ml-2">Message</label>
//                 <div className="relative">
//                     <textarea
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                         placeholder="Type your message..."
//                         className="w-full min-h-[120px] h-96 resize-y rounded-lg border px-4 pr-14 py-3 focus:outline-none"
//                     />
//                     <button
//                         onClick={handleSend}
//                         className="absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-lg bg-transparent text-primary border 
//                        hover:bg-primary hover:text-background cursor-pointer transition-all duration-500  hover:opacity-90"
//                     >
//                         <SendHorizonalIcon className="h-6 w-6" />
//                     </button>
//                     <div className="flex gap-3 absolute bottom-6 left-6 ">
//                         <button className="flex items-center cursor-pointer gap-2 px-3 py-2 text-sm rounded-lg border hover:bg-accent">
//                             <Sparkles className="h-4 w-4" /> AI Generate
//                         </button>
//                         <button
//                             onClick={handleClear}
//                             className="flex items-center cursor-pointer gap-2 px-3 py-2 text-sm rounded-lg border hover:bg-accent text-red-500"
//                         >
//                             <Trash2 className="h-4 w-4" />
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             <div className="flex flex-col gap-2">
//                 <h2 className="font-semibold">Recent Announcements</h2>
//                 {announcements.length === 0 && (
//                     <p className="text-sm text-muted-foreground">
//                         No announcements yet.
//                     </p>
//                 )}
//                 {announcements.map((a) => (
//                     <div
//                         key={a.id}
//                         className="flex flex-col gap-1 rounded-lg border px-4 py-2 text-sm"
//                     >
//                         <span className="font-medium">{a.subject}</span>
//                         <span>{a.text}</span>
//                         <span className="text-xs text-muted-foreground">
//                             Sent to: {a.recipients.join(", ")}
//                         </span>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }
