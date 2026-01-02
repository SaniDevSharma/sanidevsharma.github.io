$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
$listener.Start()
Write-Host "Server started at http://localhost:8080/"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $path = "C:/Users/pc/Documents/Sani's innovations/myportfollio" + $request.Url.LocalPath
    if ($path.EndsWith("/")) { $path += "index.html" }

    if (Test-Path $path) {
        $content = [System.IO.File]::ReadAllBytes($path)
        $response.ContentLength64 = $content.Length
        
        $extension = [System.IO.Path]::GetExtension($path)
        switch ($extension) {
            ".html" { $response.ContentType = "text/html" }
            ".js"   { $response.ContentType = "application/javascript" }
            ".css"  { $response.ContentType = "text/css" }
            ".png"  { $response.ContentType = "image/png" }
            ".jpg"  { $response.ContentType = "image/jpeg" }
        }

        $response.OutputStream.Write($content, 0, $content.Length)
    } else {
        $response.StatusCode = 404
    }
    $response.Close()
}
