import {Sidebar} from "@/components/sidebar/Sidebar";
import Tiptap from "@/components/Tiptap/Tiptap";

export default function NotesDashboard() {
    return (
        <div className={"flex flex-row h-screen w-full"}>
            <Sidebar/>
            <div className={"flex-grow flex justify-center overflow-y-scroll pt-7"}>
                <div className={"max-w-[640px] w-full"}><Tiptap/></div>

            </div>
        </div>
    );
}
