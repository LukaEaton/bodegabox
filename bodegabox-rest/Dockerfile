FROM golang:1.25-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o bodegabox-rest main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/bodegabox-rest .

EXPOSE 8080

CMD ["./bodegabox-rest"]