import {Sidebar} from "@/components/sidebar/Sidebar";

export default function Home() {
  return (
      <div className={"flex flex-row w-full"}>
        <Sidebar/>
        <div className={"flex-grow"}>

        </div>
      </div>
  );
}
