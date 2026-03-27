

import axios from 'axios';
import React, { FC, useEffect, useState } from 'react'

type Props = {
    videoUrl: string;
    title: string;
}

const CoursePlayer: FC<Props> = ({ videoUrl, title }) => {

    // Detect if this is a Cloudinary/direct URL or a VdoCipher video ID
    const isDirectUrl = videoUrl?.startsWith('http');

    const [videoData, setVideoData] = useState({
        otp: "",
        playbackInfo: "",
    });

    useEffect(() => {
        // VdoCipher API has been removed on the backend.
        // If a video ID is not a direct URL (like Cloudinary), it might be an obsolete VdoCipher ID.
        // We will no longer attempt to fetch the OTP.
        if (!isDirectUrl && videoUrl) {
            console.warn("VdoCipher is no longer supported. Please re-upload the video.");
        }
    }, [videoUrl, isDirectUrl]);

    if (!videoUrl) {
        return (
            <div style={{ paddingTop: "56.25%", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                    className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    No video available
                </div>
            </div>
        );
    }

    // Cloudinary / direct video URL — use HTML5 player
    if (isDirectUrl) {
        return (
            <div style={{ paddingTop: "56.25%", position: "relative", overflow: "hidden" }}>
                <video
                    src={videoUrl}
                    title={title}
                    controls
                    controlsList="nodownload"
                    style={{
                        position: "absolute",
                        top: 0, left: 0,
                        width: "100%", height: "100%",
                        objectFit: "contain",
                        backgroundColor: "#000",
                    }}
                />
            </div>
        );
    }

    // VdoCipher video ID — use iframe player
    return (
        <div style={{ paddingTop: "56.25%", position: "relative", overflow: "hidden" }}>
            {videoData.otp && videoData.playbackInfo !== "" && (
                <iframe
                    src={`https://player.vdocipher.com/v2/?otp=${videoData?.otp}&playbackInfo=${videoData.playbackInfo}&player=756fb00115bc410c97e7d6d69c89775f`}
                    style={{
                        position: "absolute",
                        top: 0, left: 0,
                        border: 0,
                        width: "100%", height: "100%",
                    }}
                    allowFullScreen={true}
                    allow="encrypted-media"
                ></iframe>
            )}
        </div>
    );
}

export default CoursePlayer
