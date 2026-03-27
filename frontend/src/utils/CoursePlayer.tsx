

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
        if (!isDirectUrl && videoUrl) {
            axios.post("http://localhost:7000/api/v1/getVdoCipherOTP", {
                videoId: videoUrl,
            })
            .then((res) => {
                setVideoData(res.data);
            })
            .catch(() => {});
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
