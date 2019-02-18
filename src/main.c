#include <stdio.h>
#include <emscripten/emscripten.h>
#include "../lib/duktape/duktape.h"

static duk_context *ctx = NULL;

void fatal_handler(void *udata, const char *msg) {
  if (!msg) {
    msg = "no message";
  }

  printf("%s", msg);
}

EMSCRIPTEN_KEEPALIVE
void start() {
  ctx = duk_create_heap(NULL, NULL, NULL, NULL, fatal_handler);

  duk_push_global_object(ctx);

  duk_debugger_attach(ctx,);
}

EMSCRIPTEN_KEEPALIVE
const char * eval(const char *str) {
  duk_eval_string(ctx, str);
  const char *result = duk_get_string(ctx, -1);
  duk_pop(ctx); 

  return result;
}
