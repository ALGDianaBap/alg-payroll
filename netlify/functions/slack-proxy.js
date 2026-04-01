exports.handler = async function(event) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Not allowed" };
  const { channel, text } = JSON.parse(event.body || "{}");
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) return { statusCode: 500, body: JSON.stringify({ error: "No token" }) };
  const res = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
    body: JSON.stringify({ channel, text, unfurl_links: false })
  });
  const json = await res.json();
  return { statusCode: 200, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(json) };
};
