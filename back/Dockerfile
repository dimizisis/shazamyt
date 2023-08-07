# Use the official Python base image
FROM python:3.11

RUN apt update && \
    apt install -y \
	ffmpeg

# Set the working directory inside the container
WORKDIR /app

# Copy the necessary files to the container (requirements.txt and the 'back' directory)
COPY . /app

# Install the Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Expose the port that your FastAPI application will run on (default is 8000)
EXPOSE 8000

# Command to run your FastAPI application using uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
