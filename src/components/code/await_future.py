# type: ignore

import builtins
from pyodide.ffi import to_js


async def await_future(fut):
    res = await fut
    if res is not None:
        builtins._ = res
    return to_js([res], depth=1)


await_future
