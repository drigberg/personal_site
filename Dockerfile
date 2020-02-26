FROM python:3.7.6-slim
WORKDIR /app
EXPOSE 8000
CMD python -m http.server
