import { auth0 } from "@/lib/auth0";
import './globals.css';
import {Sidebar} from "@/components/sidebar/Sidebar";
import {ProseMirrorEditor} from "@/components/editor/ProseMirrorEditor";

export default async function Home() {
    // Fetch the user session
    const session = await auth0.getSession();

    // If no session, show sign-up and login buttons
    if (!session) {
        return (
            <main>
                <a href="/auth/login?screen_hint=signup">
                    <button>Sign up</button>
                </a>
                <a href="/auth/login">
                    <button>Log in</button>
                </a>
            </main>
        );
    }

    // <main>
    //     <h1>Welcome, {session.user.name}!</h1>
    //     <p>
    //         <a href="/auth/logout">
    //             <button>Log out</button>
    //         </a>
    //     </p>
    // </main>

    // If session exists, show a welcome message and logout button
    return (

        <div className={"flex flex-row w-full"}>
            <Sidebar/>
            <div className={"flex-grow"}>
                <ProseMirrorEditor/>
            </div>
        </div>

    );
}