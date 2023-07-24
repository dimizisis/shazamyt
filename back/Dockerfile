# Use the official Python image as the base image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the backend files to the container's working directory
COPY requirements.txt .
COPY main.py .

# Create a directory called 'ytdownload' inside the 'app' directory
RUN mkdir ytdownload

# Install backend dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port on which your FastAPI app is running
EXPOSE 8000

# Start the FastAPI app using Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
