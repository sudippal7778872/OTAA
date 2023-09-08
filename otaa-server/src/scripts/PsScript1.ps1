param(
[string] $param1 = $null
)
function test()
{

    $j=0;
    for($i=0;$i -lt 10000000;$i++ ){
     $j += $i
    }
return $param1,$j
}

$greetings,$result = test
write-host $greetings,$result