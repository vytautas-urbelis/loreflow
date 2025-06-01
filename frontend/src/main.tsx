import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {pdfjs} from "react-pdf";
import WebSocketProvider from "./websocket";
import {Flip, ToastContainer} from "react-toastify";
// import React from 'react'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

createRoot(document.getElementById('root')!).render(
    <WebSocketProvider>
        <ToastContainer
            position="bottom-right"
            autoClose={2500}
            hideProgressBar={true}
            newestOnTop={true}
            closeOnClick={true}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Flip}
        />
        <App/>
    </WebSocketProvider>
)
