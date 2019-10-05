BODY_HTML = """<html>
<head></head>
<body>
  <h1>Amazon SES Test (SDK for Python)</h1>
  <p>This email was sent with
    <a href='https://aws.amazon.com/ses/'>Amazon SES</a> using the
    <a href='https://aws.amazon.com/sdk-for-python/'>
      AWS SDK for Python (Boto)</a>.</p>
      <form action="http://google.com">
        <input type="submit" value="Go to Google" />
    </form>
    <p>A really cool verification link would look like: {}
</body>
</html>
            """

r = BODY_HTML.format("Cool")
print(r)