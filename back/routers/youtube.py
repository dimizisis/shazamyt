
from fastapi import APIRouter
from shazamio import Shazam
from utils.youtube_helper import download_youtube_video_as_mp3

router = APIRouter()

@router.get("/youtube")
async def get_youtube_song_info(url: str, start='00:00:00'):
    shazam = Shazam()
    mp3_file = download_youtube_video_as_mp3(url, start)
    out = await shazam.recognize_song(mp3_file)
    return out