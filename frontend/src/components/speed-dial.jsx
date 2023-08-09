import { useDispatch } from "react-redux";
import {
    IconButton,
    SpeedDial,
    SpeedDialHandler,
    SpeedDialContent,
    SpeedDialAction,
    Tooltip
} from "@material-tailwind/react";
import {
    CodeBracketIcon,
    ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";
import {
    UserIcon,
} from "@heroicons/react/24/solid";

import { setOpen } from "../store/authSlice";


export default function BaseSpeedDial({logout}) {
    const dispatch = useDispatch();

    return (
        <div className={`hidden sm:flex fixed bottom-8 sm:bottom-12 right-8`}>
            <SpeedDial>
                <SpeedDialHandler>
                    <IconButton size="lg" className="rounded-full">
                        <UserIcon className="h-5 w-5 transition-transform group-hover:rotate-45" />
                    </IconButton>
                </SpeedDialHandler>
                <SpeedDialContent>
                    <Tooltip content="Logout" placement="left">
                        <button onClick={logout}>
                            <SpeedDialAction>
                                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                            </SpeedDialAction>
                        </button>
                    </Tooltip>

                    <Tooltip content="Explore Hackathons" placement="left">
                        <button onClick={() => dispatch(setOpen(true))}>
                            <SpeedDialAction>
                                <CodeBracketIcon className="h-5 w-5" />
                            </SpeedDialAction>
                        </button>   
                    </Tooltip>
                </SpeedDialContent>
            </SpeedDial>
        </div>
    );
}