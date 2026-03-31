
import React, { FC } from 'react'

type Props = {
    videoUrl: string;
    title: string;
}

const CoursePlayer: FC<Props> = ({ videoUrl, title }) => {

    const getPlayer = () => {
        if (!videoUrl) {
            return (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                    className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    No video available
                </div>
            );
        }

        // Direct Cloudinary / HTTP video URL
        if (videoUrl.startsWith('http')) {
            return (
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
            );
        }

        return (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Invalid video URL (Must be a direct Cloudinary link)
            </div>
        );
    }

    return (
        <div style={{ paddingTop: "56.25%", position: "relative", overflow: "hidden" }} className="rounded-lg shadow-lg">
            {getPlayer()}
        </div>
    );
}

export default CoursePlayer
