import {UserPie} from "@/components/sidebar/UserPie";

export function Sidebar() {
    return (
        <div className={"w-64 h-full bg-slate-100 border-slate-400 border-r flex flex-col p-4 justify-between"}>
            <div>New note +</div>
            <UserPie/>
        </div>
    );
}