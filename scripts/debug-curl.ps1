
$Url = "https://base.publicnode.com"
$Headers = @{
    "Content-Type" = "application/json"
}
$Body = '{
    "jsonrpc": "2.0",
    "method": "eth_getLogs",
    "params": [{
        "address": "0x09aea4b2242abc8bb4bb78d537a67a245a7bec64",
        "fromBlock": "latest"
    }],
    "id": 1
}'

$Response = Invoke-RestMethod -Uri $Url -Method Post -Headers $Headers -Body $Body
Write-Output "Full Response:"
$Response | ConvertTo-Json -Depth 5
