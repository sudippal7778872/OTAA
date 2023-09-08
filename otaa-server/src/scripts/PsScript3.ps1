param(
[string] $param1 = $null,
[string] $param2 = $null
)
function test()
{

    $j=0;
    for($i=0;$i -lt 10000000;$i++ ){
     $j += $i
    }
return $param1,$param2,$j
}

$greetings,$ask,$result = test
write-host $greetings,$ask,$result