# InboxPilot — AI Support Triage Demo

A small portfolio prototype that turns a support message into a structured triage suggestion: category, priority, summary, recommended next step, and a draft reply. Every result stays behind a human review gate. The demo does not send replies, issue refunds, alter customer records, or store submitted messages.

## What it demonstrates

- Python HTTP server and a small browser UI
- OpenAI Responses API integration, with the API key kept on the server
- JSON parsing and validation against allowed categories and priorities
- Input length limits, generic provider error handling, and no message logging
- A separate sample preview mode that makes no AI API request
- Human approval required for every result

## Run the sample preview

Python 3.10 or newer is recommended. No third-party Python packages are required.

```powershell
cd ai-support-triage-demo
python app.py
```

Open http://127.0.0.1:8000 and select **Load sample preview**. This uses illustrative sample output and does not call an AI model.

## Run live AI triage

Create an API key in your AI provider account, then set it only in your local terminal. Do not put a real key in the browser, project files, screenshots, or a public repository.

```powershell
$env:OPENAI_API_KEY = "your-api-key"
$env:OPENAI_MODEL = "gpt-6-luna"
python app.py
```

Select **Run live AI triage** and enter non-sensitive sample text. The request goes to the OpenAI Responses API and may incur API usage charges. The default model can be changed with `OPENAI_MODEL` if your account uses another supported model. Check current model availability and pricing in your provider account before using live requests.

## Workflow

1. A support message enters the demo inbox.
2. The Python server sends the text to the Responses API with a constrained classification instruction.
3. The server parses and validates the returned JSON fields.
4. The UI displays the classification and a reply draft for a person to review.
5. No outbound action occurs automatically.

## Limits

This is a local prototype, not a production support system. It has no authentication, durable database, real mailbox/CRM connection, rate limiting, or production deployment configuration. Do not submit customer secrets or personal data. A production build should add access control, approved data handling, monitoring, retries, and a real inbox integration.

## Portfolio honesty

The activity numbers and customer details shown in the interface are illustrative sample data. They are not measured client results. Describe this as a self-directed prototype unless it has been adapted and used for a real client.

## API reference

New projects should use the Responses API. See the [OpenAI Responses API documentation](https://platform.openai.com/docs/guides/text) and check current [model pricing](https://platform.openai.com/pricing).
