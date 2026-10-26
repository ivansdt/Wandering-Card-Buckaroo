function start()
{
    document.addEventListener('keydown', OnKeyDown);
    Update();
}

function OnKeyDown(e)
{
    console.log(e.key);
    if (e.key == "D")
    {
        nodeCount += 1;
    }
    if (e.key == "A")
    {
        nodeCount -= 1;
    }
}
