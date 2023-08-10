
import os
import yt_dlp
from fastapi import HTTPException
from datetime import datetime

def download_youtube_video_as_mp3(url: str, start: str):
    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'postprocessor_args': [
            '-ss', start,
        ],
        'prefer_ffmpeg': True,
        'outtmpl': f'{os.getenv("DOWNLOAD_PATH", "/app/ytdownload")}/{timestamp}.%(ext)s',  # Output path for downloaded MP3
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            _ = ydl.extract_info(url, download=True)
        return f'{os.getenv("DOWNLOAD_PATH", "/app/ytdownload")}/{timestamp}.mp3'
    except yt_dlp.DownloadError:
        raise HTTPException(status_code=400, detail="Invalid YouTube link")
