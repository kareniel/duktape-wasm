#include <stdio.h>
#include <emscripten/emscripten.h>
#include "../lib/duktape/duktape.h"

static duk_context *ctx = NULL;

typedef void js_cb();

js_cb* js_read_cb;
js_cb* js_write_cb;

void fatal_handler(void *udata, const char *msg) {
  if (!msg) {
    msg = "no message";
  }

  EM_ASM_({
    console.log($0);
  }, msg);
}

duk_size_t read_cb (void *udata, char *buffer, duk_size_t length) {
  js_read_cb(buffer, length);

  return length;
}

duk_size_t write_cb (void *udata, const char *buffer, duk_size_t length) {
  js_write_cb(buffer, length);

  return length;
}

EMSCRIPTEN_KEEPALIVE
void start(int read_cb_ptr, int write_cb_ptr) {
  js_read_cb = ((js_cb*)read_cb_ptr);
  js_write_cb = ((js_cb*)write_cb_ptr);

  ctx = duk_create_heap(NULL, NULL, NULL, NULL, fatal_handler);

  duk_push_global_object(ctx);

}

EMSCRIPTEN_KEEPALIVE
const char * eval(const char *str) {
  duk_eval_string(ctx, str);
  const char *result = duk_get_string(ctx, -1);
  duk_pop(ctx); 

  return result;
}

EMSCRIPTEN_KEEPALIVE
void debug() {
  duk_debugger_attach(ctx, read_cb, write_cb, NULL, NULL, NULL, NULL, NULL, NULL);
}
