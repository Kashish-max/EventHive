import { useState, useEffect } from 'react';

import "quill/dist/quill.snow.css";

const toolbarOptions = [
    ["bold", "italic", "underline", "strike"],        // toggled buttons
    ['link'],
    ["blockquote", "code-block"],
  
    [{ "list": "ordered"}, { "list": "bullet" }],
    [{ "script": "sub"}, { "script": "super" }],      // superscript/subscript
    [{ "indent": "-1"}, { "indent": "+1" }],          // outdent/indent
    [{ "direction": "rtl" }],                         // text direction
  
    [{ "header": [1, 2, 3, 4, 5, 6, false] }],
  
    [{ "color": [] }, { "background": [] }],          // dropdown with defaults from theme
    [{ "align": [] }],
  
    ["clean"]                                         // remove formatting button
];
  
export default function Editor({ initalContents, setContents }) {
    const [quill, setQuill] = useState();

    // Initialize Quill instance and set initial contents"
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const Quill = require('quill');
            const quillServer = new Quill("#container", { 
                theme: "snow", 
                modules: { 
                    toolbar: toolbarOptions,
                }
            });
            quillServer.enable();
            quillServer.updateContents(initalContents);
            setQuill(quillServer);
            setContents(quillServer.root.innerHTML);
        }
    }, []);

    // Handle the text-change event
    useEffect(() => {
        if (quill === null) return;

        const handleChange = (delta, oldData, source) => {
            if (source !== "user") return;

            setContents(quill.root.innerHTML);
        }
        quill && quill.on("text-change", handleChange);
        return () => {
            quill && quill.off("text-change", handleChange);
        }
    }, [quill])

    return (
        <div>
            <div id="container" className="h-full font-normal text-gray-900 !font-[ProductSans]"></div>
        </div>
    )
}