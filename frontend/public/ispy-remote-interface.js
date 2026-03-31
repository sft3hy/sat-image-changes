(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if (typeof define === 'function' && define.amd)
        define([], factory);
    else if (typeof exports === 'object')
        exports["iSpy"] = factory();
    else
        root["iSpy"] = factory();
})(self, () => {
    return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/events/poll/index.js":
/*!********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/events/poll/index.js ***!
  \********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

                    __webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ poll)
                        /* harmony export */
});
/* harmony import */ var _stream__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../stream */ "./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/events/stream/index.js");
/* harmony import */ var _util_request__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/request */ "./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/util/request/index.js");


                    var PollStatus;
                    (function (PollStatus) {
                        PollStatus["SUCCESS"] = "SUCCESS";
                        PollStatus["ERROR"] = "ERROR";
                    })(PollStatus || (PollStatus = {}));
                    function poll({ url, intervalMS, requestOptions, getQueryParams = () => ({}) }) {
                        const makeRequest = () => fetch(url + (0, _util_request__WEBPACK_IMPORTED_MODULE_1__.createParamString)(getQueryParams()), {
                            method: 'GET',
                            mode: 'cors',
                            ...requestOptions,
                        }).then(response => {
                            if (!response.ok) {
                                const json = response.json();
                                return json
                                    .catch(e => {
                                        throw Error(response.statusText);
                                    })
                                    .then(e => {
                                        throw Error(e.errorMessage);
                                    });
                            }
                            else {
                                return response.json();
                            }
                        });
                        return new _stream__WEBPACK_IMPORTED_MODULE_0__["default"](emit => {
                            let startTime;
                            let completed = false;
                            const onComplete = () => {
                                completed = true;
                                emit.complete();
                            };
                            const makeRequestRecursive = async () => {
                                if (completed) {
                                    return;
                                }
                                startTime = Date.now();
                                try {
                                    const response = await makeRequest();
                                    if (completed) {
                                        return;
                                    }
                                    const timeEllapsed = Date.now() - startTime;
                                    const timeToNextRequest = intervalMS - timeEllapsed;
                                    setTimeout(makeRequestRecursive, timeToNextRequest);
                                    emit.next(response);
                                }
                                catch (e) {
                                    if (!completed) {
                                        const timeEllapsed = Date.now() - startTime;
                                        const timeToNextRequest = intervalMS - timeEllapsed;
                                        setTimeout(makeRequestRecursive, timeToNextRequest);
                                    }
                                    emit.error(e);
                                }
                            };
                            makeRequestRecursive();
                            return onComplete;
                        });
                    }
                    //# sourceMappingURL=index.js.map

                    /***/
}),

/***/ "./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/events/socket/data-providers/http/index.js":
/*!******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/events/socket/data-providers/http/index.js ***!
  \******************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

                    __webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ httpProvider)
                        /* harmony export */
});
/* harmony import */ var _poll__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../poll */ "./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/events/poll/index.js");

                    /**
                     * DataProvider for Sockets that uses regular HTTP calls
                     * to push/pull data.
                     *
                     * Periodically polls the server at the provided `pollUrl`
                     * for new data
                     *
                     * @param {string} publishUrl
                     * @param {string} pollUrl
                     * @returns {SocketDataProvider}
                     */
                    function httpProvider({ publishUrl, pollUrl, intervalMS = 1000, publishRequestOptions, pollRequestOptions, getQueryParams, messagesSelector = f => f, }) {
                        return {
                            send: message => {
                                fetch(publishUrl, {
                                    method: 'POST',
                                    mode: 'cors',
                                    ...publishRequestOptions,
                                    body: JSON.stringify(message),
                                });
                            },
                            connect: (onConnectSuccess, onConnectError) => {
                                // TODO figure out a good way to handle initial connection errors
                                let isFirstPoll = true;
                                return (0, _poll__WEBPACK_IMPORTED_MODULE_0__["default"])({ url: pollUrl, intervalMS, requestOptions: pollRequestOptions, getQueryParams })
                                    .map(_messages => {
                                        if (isFirstPoll) {
                                            onConnectSuccess?.();
                                            isFirstPoll = false;
                                        }
                                        return _messages;
                                    })
                                    .map(messagesSelector);
                            },
                        };
                    }
                    //# sourceMappingURL=index.js.map

                    /***/
}),

/***/ "./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/events/socket/data-providers/websocket/index.js":
/*!***********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/events/socket/data-providers/websocket/index.js ***!
  \***********************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

                    __webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ websocketProvider),
/* harmony export */   "websocketFallbackDataProvider": () => (/* binding */ websocketFallbackDataProvider)
                        /* harmony export */
});
/* harmony import */ var _http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../http */ "./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/events/socket/data-providers/http/index.js");
/* harmony import */ var _stream__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../stream */ "./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/events/stream/index.js");


                    /**
                     * DataProvider for a Socket that uses WebSockets as the transport medium
                     *
                     * @param {string} url Websocket endpoint
                     * @returns {SocketDataProvider}
                     */
                    function websocketProvider({ socketUrl, messagesSelector = message => [message], }) {
                        let socket;
                        /** Stores messages that could not be sent due to closed socket */
                        let messageQueue = [];
                        /** Guarantees only one reconnect attempt will occur at a time */
                        let reconnecting = false;
                        /** Used for instant reconnect attempt if a close event received is not initiated by the client */
                        let attemptReconnect = false;
                        /** Emitter stored locally so it can be reused in reconnect attempts */
                        let emitter;
                        /** The standard set of socket events listened for assuming a succesful connection */
                        const setupSocketEvents = () => {
                            socket.onmessage = ({ data }) => emitter.next(JSON.parse(data));
                            socket.onerror = e => {
                                console.warn('WebSocket error:', e);
                                emitter.error();
                            };
                            socket.onclose = ev => {
                                console.warn(`WebSocket received close event: [${ev.code}] ${ev.reason}.`, attemptReconnect ? 'Attempting reconnection...' : '');
                                // Only attempt reconnects if the server closed the connection instead of the client
                                if (attemptReconnect) {
                                    reconnect();
                                }
                                emitter.complete();
                            };
                        };
                        const reconnect = () => {
                            if (reconnecting) {
                                return;
                            }
                            reconnecting = true;
                            try {
                                socket = new WebSocket(socketUrl);
                                socket.onopen = () => {
                                    reconnecting = false;
                                    console.warn(`WebSocket succesfully reconnected, retransmitting ${messageQueue.length} messages.`);
                                    messageQueue.forEach(message => socket.send(JSON.stringify(message)));
                                    messageQueue = [];
                                    setupSocketEvents();
                                };
                                socket.onerror = () => {
                                    reconnecting = false;
                                    console.error('Unable to reconnect WebSocket');
                                };
                            }
                            catch (e) {
                                reconnecting = false;
                                console.error('Unable to reconnect WebSocket');
                            }
                        };
                        return {
                            send: message => {
                                if (!socket) {
                                    console.warn('WebsocketProvider WARNING: Attempting to publish payload via a socket that has not been initialized', message);
                                }
                                else if (socket.readyState !== WebSocket.OPEN) {
                                    console.warn('WebsocketProvider WARNING: Attempting to publish message', message, 'to a closed/closing socket, attempting reconnection...');
                                    messageQueue.push(message);
                                    reconnect();
                                }
                                else {
                                    socket.send(JSON.stringify(message));
                                }
                            },
                            connect: (onConnectSuccess = () => { }, onConnectError = () => { }) => {
                                try {
                                    socket = new WebSocket(socketUrl);
                                    socket.onopen = () => {
                                        attemptReconnect = true;
                                        onConnectSuccess();
                                    };
                                }
                                catch (e) {
                                    console.error('Error creating WebSocket at url', socketUrl, e);
                                    onConnectError(e);
                                    return _stream__WEBPACK_IMPORTED_MODULE_1__["default"].empty();
                                }
                                return new _stream__WEBPACK_IMPORTED_MODULE_1__["default"](emit => {
                                    emitter = emit;
                                    setupSocketEvents();
                                    return () => {
                                        attemptReconnect = false;
                                        socket.close();
                                    };
                                }).map(messagesSelector);
                            },
                        };
                    }
                    /**
                     * Check if WebSockets are supported and if we can connect to a WebSocket endpoint
                     */
                    const testWebSocket = async (url) => {
                        if (typeof WebSocket !== 'function') {
                            return false;
                        }
                        return new Promise((resolve, reject) => {
                            try {
                                const socket = new WebSocket(url);
                                socket.onopen = () => {
                                    resolve(true);
                                    socket.close();
                                };
                                socket.onerror = e => {
                                    console.log('testWebSocket: WebSocket connection failed', e);
                                    resolve(false);
                                    socket.close();
                                };
                            }
                            catch (e) {
                                console.log('testWebSocket: WebSocket connection failed', e);
                                resolve(false);
                            }
                        });
                    };
                    function websocketFallbackDataProvider({ http, socket }) {
                        let internalProvider;
                        return {
                            connect: (onConnectSuccess, onConnectError) => {
                                const promise = new Promise(async (resolve, reject) => {
                                    const isWebSocketSupported = await testWebSocket(socket.socketUrl);
                                    if (isWebSocketSupported) {
                                        resolve(websocketProvider(socket));
                                    }
                                    resolve((0, _http__WEBPACK_IMPORTED_MODULE_0__["default"])(http));
                                });
                                return _stream__WEBPACK_IMPORTED_MODULE_1__["default"].fromPromise(promise).flatMap(dataProvider => {
                                    internalProvider = dataProvider;
                                    return internalProvider.connect(onConnectSuccess, onConnectError);
                                });
                            },
                            send: message => {
                                if (!internalProvider) {
                                    console.warn('WebsocketProvider WARNING: Attempting to publish payload via a socket that has not been initialized');
                                }
                                else {
                                    internalProvider.send(message);
                                }
                            },
                        };
                    }
                    //# sourceMappingURL=index.js.map

                    /***/
}),

/***/ "./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/events/socket/index.js":
/*!**********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/events/socket/index.js ***!
  \**********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

                    __webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Socket)
                        /* harmony export */
});
/* harmony import */ var _stream__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../stream */ "./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/events/stream/index.js");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/events/socket/types.js");

                    /**
                     * Factory function used to create a new Socket for sending and
                     * receiving events to and from the server.
                     *
                     * If `window.__SOCKET_DEBUG__` is defined, all messages will be logged to the console
                     *
                     * @param dataProvider DataProvider used to push/pull data to/from the server
                     */
                    function Socket({ dataProvider, typeSelector, messageTransformer = f => f, }) {
                        const streams = {};
                        const listeners = {};
                        let dataSub;
                        const disconnect = () => dataSub && dataSub.unsubscribe();
                        return {
                            connect: () => {
                                return new Promise((resolve, reject) => {
                                    dataSub = dataProvider
                                        .connect(resolve,
                                            // If the socket fails to open, disconnect all subscribers
                                            e => {
                                                reject(e);
                                                disconnect();
                                            })
                                        .subscribe({
                                            next: messages => {
                                                if (window.__SOCKET_DEBUG__) {
                                                    messages.forEach(message => console.log(message));
                                                }
                                                messages.map(messageTransformer).forEach(message => {
                                                    // TODO remove the 'as any' when we upgrade to TS 3.*...
                                                    //      doesn't work in 2.9.*
                                                    const type = typeSelector(message);
                                                    if (listeners[type]) {
                                                        listeners[type].next(message);
                                                    }
                                                });
                                            },
                                            error: e => {
                                                // TODO figure out what should happen if we see an error
                                                // WebSockets Provider will not pass an error since it contains no useful information (info in close event)
                                                if (e) {
                                                    console.warn('socket error', e);
                                                }
                                            },
                                            complete: () => Object.keys(listeners).forEach(type => listeners[type].complete()),
                                        });
                                });
                            },
                            disconnect,
                            publish: message => {
                                dataProvider.send(message);
                            },
                            on: type => {
                                const _type = type;
                                if (!streams[_type]) {
                                    streams[_type] = new _stream__WEBPACK_IMPORTED_MODULE_0__["default"](emit => {
                                        listeners[_type] = emit;
                                    });
                                }
                                return streams[_type];
                            },
                        };
                    }

                    //# sourceMappingURL=index.js.map

                    /***/
}),

/***/ "./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/events/socket/types.js":
/*!**********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/events/socket/types.js ***!
  \**********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

                    __webpack_require__.r(__webpack_exports__);

                    //# sourceMappingURL=types.js.map

                    /***/
}),

/***/ "./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/events/stream/index.js":
/*!**********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/events/stream/index.js ***!
  \**********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

                    __webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
                        /* harmony export */
});
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/events/stream/utils.js");

                    class Stream {
                        /**
                         * @param onMount Callback function executed when the stream is initialized
                         *  This function is passed the emitter object so it can define the behavior of the emitter.
                         */
                        constructor(onMount) {
                            this.subscriptions = [];
                            this.onMount = onMount;
                            this.onUnmount = undefined;
                        }
                        /**
                         * Basic stream of a single value.
                         * Emits the value 1 time and then completes.
                         */
                        static of(val) {
                            return new Stream(emit => {
                                emit.next(val);
                                emit.complete();
                            });
                        }
                        /**
                         * Create an empty stream (a stream that never publishes any values)
                         */
                        static empty() {
                            return new Stream(emit => emit.complete());
                        }
                        /**
                         * Create a periodic stream that emits every n milliseconds
                         * @param intervalMS Interval time in milliseconds
                         */
                        static periodic(intervalMS) {
                            return new Stream(emit => {
                                const id = setInterval(emit.next, intervalMS);
                                return () => {
                                    clearInterval(id);
                                    emit.complete();
                                };
                            });
                        }
                        /**
                         * Create a new stream that emits after the specified number of milliseconds
                         */
                        static timeout(timeMS) {
                            return Stream.of(undefined).delay(timeMS);
                        }
                        /**
                         * Create a stream from a promise
                         */
                        static fromPromise(promise) {
                            return new Stream(emit => {
                                let completed = false;
                                // Make sure we don't call `emit.complete` multiple times if the subscription is canceled
                                const onComplete = () => {
                                    if (!completed) {
                                        completed = true;
                                        emit.complete();
                                    }
                                };
                                promise
                                    .then(value => {
                                        if (!completed) {
                                            emit.next(value);
                                        }
                                    })
                                    .catch(emit.error)
                                    .then(onComplete);
                                return onComplete;
                            });
                        }
                        /**
                         * Create an event stream on a dom element
                         */
                        static fromDomEvent(type, element = document) {
                            return new Stream(emit => {
                                element.addEventListener(type, emit.next);
                                return () => {
                                    emit.complete();
                                    element.removeEventListener(type, emit.next);
                                };
                            });
                        }
                        /**
                         * Create a stream from an event fired by an EventSystem.
                         * **Note** Due to TypeScript's generic type inferrence limitations, in order to correctly
                         * type the stream, this acts as a factory function that first takes the event system,
                         * then returns a function that takes the type of the event and returns the stream.
                         *
                         * Example:
                         *
                         * ```
                         * Stream.fromInternalEvent(myEventSystem)('ON_CHANGE')
                         * ```
                         */
                        static fromInternalEvent(eventSystem) {
                            return (type) => new Stream(emit => {
                                const id = eventSystem.on(type, emit.next);
                                return () => {
                                    emit.complete();
                                    eventSystem.off(type, id);
                                };
                            });
                        }
                        /**
                         * Create a new stream from a Redux store.
                         * @param store Redux store
                         */
                        static fromStore(store) {
                            return new Stream(emit => {
                                const unsub = store.subscribe(() => emit.next(store.getState()));
                                return () => {
                                    emit.complete();
                                    unsub();
                                };
                            });
                        }
                        /**
                         * Create a new stream from an array.
                         * This allows you to filter/map over each element in the array individually.
                         */
                        static fromArray(arr) {
                            return new Stream(emit => {
                                arr.map(emit.next);
                                emit.complete();
                            });
                        }
                        subscribe(...args) {
                            let emitter = args[0];
                            if (typeof args[0] === 'function') {
                                emitter = { next: args[0], error: args[1], complete: args[2] };
                            }
                            emitter = makeValid(emitter);
                            const sub = makeSubscription(emitter, () => this.unsubscribe(sub));
                            this.subscriptions = this.subscriptions.concat(sub);
                            if (this.subscriptions.length === 1) {
                                // Create an internal emitter used to emit values to listeners
                                const ownEmitter = {
                                    next: (val) => this.fire('next', val),
                                    error: (err) => this.fire('error', err),
                                    complete: () => this.fire('complete'),
                                };
                                this.mount(ownEmitter);
                            }
                            return sub;
                        }
                        /**
                         * Apply function `f` to this stream
                         */
                        map(f) {
                            return (0, _utils__WEBPACK_IMPORTED_MODULE_0__.map)(f, this);
                        }
                        /**
                         * Apply function `f` to this stream and concatenate the two streams
                         */
                        flatMap(f) {
                            return (0, _utils__WEBPACK_IMPORTED_MODULE_0__.flatMap)(f, this);
                        }
                        /**
                         * Filter the values emitted by this stream
                         * @param predicate Predicate function used to filter the values
                         */
                        filter(predicate) {
                            return (0, _utils__WEBPACK_IMPORTED_MODULE_0__.filter)(predicate, this);
                        }
                        /**
                         * Ensure this stream closes after emitting one value
                         */
                        once() {
                            return (0, _utils__WEBPACK_IMPORTED_MODULE_0__.once)(this);
                        }
                        /**
                         * Delay each value emitted by this stream by the specified number of milliseconds
                         */
                        delay(timeMS) {
                            return (0, _utils__WEBPACK_IMPORTED_MODULE_0__.delay)(timeMS, this);
                        }
                        /**
                         * Returns a new stream that only completes once this stream, along with the provided streams, have all completed
                         */
                        all(streams) {
                            return (0, _utils__WEBPACK_IMPORTED_MODULE_0__.all)(streams.concat(this));
                        }
                        /**
                         * Limit the stream so it will close after emitting a certain number of values
                         * @param n Max number of values
                         */
                        limit(n) {
                            return (0, _utils__WEBPACK_IMPORTED_MODULE_0__.limit)(n, this);
                        }
                        /**
                         * Called to initialize the stream and start emitting values
                         * @param emitter
                         */
                        mount(emitter) {
                            this.onUnmount = this.onMount(emitter) || undefined;
                        }
                        unsubscribe(sub) {
                            const newSubList = this.subscriptions.filter(s => s !== sub);
                            if (newSubList.length === 0 && typeof this.onUnmount === 'function') {
                                this.onUnmount();
                            }
                            this.subscriptions = newSubList;
                        }
                        /**
                         * Util function for emitting values to subscribers
                         */
                        fire(fn, val) {
                            this.subscriptions
                                .map(sub => sub.emitter[fn])
                                .filter(callback => typeof callback === 'function')
                                .forEach(callback => callback(val));
                        }
                    }
                    const NO_OP = () => { };
                    /* Fill an emitter's empty properties with no-ops */
                    const makeValid = ({ next = NO_OP, error = NO_OP, complete = NO_OP } = {}) => ({
                        next,
                        error,
                        complete,
                    });
                    const makeSubscription = (emitter, unsubscribe) => ({
                        emitter,
                        unsubscribe,
                    });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Stream);
                    //# sourceMappingURL=index.js.map

                    /***/
}),

/***/ "./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/events/stream/utils.js":
/*!**********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/events/stream/utils.js ***!
  \**********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

                    __webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "all": () => (/* binding */ all),
/* harmony export */   "delay": () => (/* binding */ delay),
/* harmony export */   "filter": () => (/* binding */ filter),
/* harmony export */   "flatMap": () => (/* binding */ flatMap),
/* harmony export */   "limit": () => (/* binding */ limit),
/* harmony export */   "map": () => (/* binding */ map),
/* harmony export */   "once": () => (/* binding */ once)
                        /* harmony export */
});
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/events/stream/index.js");

                    function map(f, stream) {
                        if (!stream) {
                            return s => map(f, s);
                        }
                        return new _index__WEBPACK_IMPORTED_MODULE_0__["default"](emit => {
                            const newSub = stream.subscribe({ ...emit, next: (val) => emit.next(f(val)) });
                            return () => newSub.unsubscribe();
                        });
                    }
                    /**
                     * Create a new stream that will close after emitting 1 value
                     */
                    function once(stream) {
                        return limit(1, stream);
                    }
                    function limit(n, stream) {
                        if (!stream) {
                            return s => limit(n, s);
                        }
                        return new _index__WEBPACK_IMPORTED_MODULE_0__["default"](emit => {
                            let timesEmitted = 0;
                            let completeCalled = false;
                            const next = (val) => {
                                if (completeCalled) {
                                    return;
                                }
                                emit.next(val);
                                timesEmitted++;
                                if (timesEmitted >= n) {
                                    emit.complete();
                                    if (newSub) {
                                        newSub.unsubscribe();
                                    }
                                }
                            };
                            const complete = () => {
                                completeCalled = true;
                            };
                            const newSub = stream.subscribe({ ...emit, next, complete });
                            return () => {
                                if (newSub) {
                                    newSub.unsubscribe();
                                }
                            };
                        });
                    }
                    function filter(predicate, stream) {
                        if (!stream) {
                            return s => filter(predicate, s);
                        }
                        return new _index__WEBPACK_IMPORTED_MODULE_0__["default"](emit => {
                            const next = (val) => {
                                if (predicate(val)) {
                                    emit.next(val);
                                }
                            };
                            const newSub = stream.subscribe({ ...emit, next });
                            return () => newSub.unsubscribe();
                        });
                    }
                    function flatMap(f, stream) {
                        if (!stream) {
                            return s => flatMap(f, s);
                        }
                        return new _index__WEBPACK_IMPORTED_MODULE_0__["default"](emit => {
                            let newSub;
                            const next = (val) => {
                                if (newSub) {
                                    newSub.unsubscribe();
                                }
                                newSub = f(val).subscribe(emit);
                            };
                            const oldSub = stream.subscribe({ ...emit, next });
                            return () => {
                                oldSub.unsubscribe();
                                if (newSub) {
                                    newSub.unsubscribe();
                                }
                            };
                        });
                    }
                    /**
                     * Create a new stream that only completes once all
                     * provided streams have completed
                     */
                    function all(streams) {
                        return new _index__WEBPACK_IMPORTED_MODULE_0__["default"](emit => {
                            let numCompleted = 0;
                            const complete = () => {
                                numCompleted++;
                                if (numCompleted >= streams.length) {
                                    emit.complete();
                                }
                            };
                            const subs = streams.map((s, i) => s.subscribe({ ...emit, complete }));
                            return () => subs.forEach(s => s.unsubscribe());
                        });
                    }
                    /**
                     * Delays all `next` values by the specified number of milliseconds
                     */
                    function delay(timeMS, stream) {
                        return new _index__WEBPACK_IMPORTED_MODULE_0__["default"](emit => {
                            let nextId, completeId;
                            const next = (val) => (nextId = window.setTimeout(() => emit.next(val), timeMS));
                            const complete = () => (completeId = window.setTimeout(() => emit.complete(), timeMS));
                            const newSub = stream.subscribe({ ...emit, next, complete });
                            return () => {
                                clearTimeout(nextId);
                                clearTimeout(completeId);
                                newSub.unsubscribe();
                            };
                        });
                    }
                    //# sourceMappingURL=utils.js.map

                    /***/
}),

/***/ "./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/util/request/index.js":
/*!*********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/util/request/index.js ***!
  \*********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

                    __webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createDeleteRequest": () => (/* binding */ createDeleteRequest),
/* harmony export */   "createGenericDeleteRequest": () => (/* binding */ createGenericDeleteRequest),
/* harmony export */   "createGenericGetRequest": () => (/* binding */ createGenericGetRequest),
/* harmony export */   "createGenericPostRequest": () => (/* binding */ createGenericPostRequest),
/* harmony export */   "createGenericPutRequest": () => (/* binding */ createGenericPutRequest),
/* harmony export */   "createGetRequest": () => (/* binding */ createGetRequest),
/* harmony export */   "createJsonToXmlRequest": () => (/* binding */ createJsonToXmlRequest),
/* harmony export */   "createParamString": () => (/* binding */ createParamString),
/* harmony export */   "createPostRequest": () => (/* binding */ createPostRequest),
/* harmony export */   "createPutRequest": () => (/* binding */ createPutRequest),
/* harmony export */   "createXmlPostRequest": () => (/* binding */ createXmlPostRequest),
/* harmony export */   "createXmlToJsonRequest": () => (/* binding */ createXmlToJsonRequest)
                        /* harmony export */
});
                    const createGenericPostRequest = (apiUrl, contentType) => {
                        const postRequest = (endpointUrl, args) => {
                            const fullUrl = apiUrl + endpointUrl;
                            return fetch(fullUrl, {
                                credentials: 'include',
                                method: 'POST',
                                mode: 'cors',
                                headers: { 'Content-Type': contentType },
                                body: args,
                            });
                        };
                        return postRequest;
                    };
                    const createPostRequest = (apiUrl, init) => {
                        const postRequest = (endpointUrl, args) => {
                            const fullUrl = apiUrl + endpointUrl;
                            return fetch(fullUrl, {
                                credentials: 'include',
                                method: 'POST',
                                mode: 'cors',
                                headers: { 'Content-Type': 'application/json' },
                                ...init,
                                body: JSON.stringify(args),
                            }).then(response => {
                                if (!response.ok) {
                                    const json = response.json();
                                    return json
                                        .catch(() => {
                                            throw Error(response.statusText);
                                        })
                                        .then((e) => {
                                            throw Error(e.errorMessage);
                                        });
                                }
                                else {
                                    return response.json();
                                }
                            });
                        };
                        return postRequest;
                    };
                    const createJsonToXmlRequest = (apiUrl) => {
                        const postRequest = (endpointUrl, args) => {
                            const fullUrl = apiUrl + endpointUrl;
                            return fetch(fullUrl, {
                                credentials: 'include',
                                method: 'POST',
                                mode: 'cors',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(args),
                            }).then(response => {
                                if (!response.ok) {
                                    const text = response.text();
                                    return text
                                        .catch(() => {
                                            throw Error(response.statusText);
                                        })
                                        .then((e) => {
                                            throw Error(e.errorMessage);
                                        });
                                }
                                else {
                                    return response.text();
                                }
                            });
                        };
                        return postRequest;
                    };
                    const createXmlToJsonRequest = (apiUrl) => {
                        const postRequest = (endpointUrl, xmlRequest) => {
                            const fullUrl = apiUrl + endpointUrl;
                            return fetch(fullUrl, {
                                credentials: 'include',
                                method: 'POST',
                                mode: 'cors',
                                headers: { 'Content-Type': 'application/json' }, // notice '/json', this is a bug on the product server.
                                body: xmlRequest,
                            }).then(response => {
                                if (!response.ok) {
                                    const json = response.json();
                                    return json
                                        .catch(() => {
                                            throw Error(response.statusText);
                                        })
                                        .then((e) => {
                                            throw Error(e.errorMessage);
                                        });
                                }
                                else {
                                    return response.json();
                                }
                            });
                        };
                        return postRequest;
                    };
                    const createXmlPostRequest = (apiUrl, mimetype = 'application/xml') => {
                        const postRequest = (endpointUrl, xmlRequest) => {
                            const fullUrl = apiUrl + endpointUrl;
                            return fetch(fullUrl, {
                                credentials: 'include',
                                method: 'POST',
                                mode: 'cors',
                                headers: { 'Content-Type': mimetype },
                                body: xmlRequest,
                            }).then(response => {
                                if (!response.ok) {
                                    const text = response.text();
                                    return text
                                        .catch(() => {
                                            throw Error(response.statusText);
                                        })
                                        .then((e) => {
                                            throw Error(e);
                                        });
                                }
                                else {
                                    return response.text();
                                }
                            });
                        };
                        return postRequest;
                    };
                    const createGenericGetRequest = (apiUrl, contentType, init) => {
                        const getRequest = (endpointUrl) => {
                            const fullUrl = apiUrl + endpointUrl;
                            return fetch(fullUrl, {
                                credentials: 'include',
                                method: 'GET',
                                mode: 'cors',
                                headers: { 'Content-Type': contentType ? contentType : 'application/json' },
                                ...init,
                            });
                        };
                        return getRequest;
                    };
                    const createGetRequest = (apiUrl, init) => {
                        const getRequest = (endpointUrl) => {
                            const fullUrl = apiUrl + endpointUrl;
                            return fetch(fullUrl, {
                                credentials: 'include',
                                method: 'GET',
                                mode: 'cors',
                                headers: { 'Content-Type': 'application/json' },
                                ...init,
                            }).then(response => {
                                if (!response.ok) {
                                    const json = response.json();
                                    return json
                                        .catch(e => {
                                            throw Error(response.statusText);
                                        })
                                        .then(e => {
                                            throw Error(e.errorMessage);
                                        });
                                }
                                else {
                                    return response.json();
                                }
                            });
                        };
                        return getRequest;
                    };
                    const createGenericDeleteRequest = (apiUrl, contentType) => {
                        const deleteRequest = (endpointUrl) => {
                            const fullUrl = apiUrl + endpointUrl;
                            return fetch(fullUrl, {
                                credentials: 'include',
                                method: 'DELETE',
                                mode: 'cors',
                                headers: { 'Content-Type': contentType ? contentType : 'application/json' },
                            });
                        };
                        return deleteRequest;
                    };
                    const createDeleteRequest = (apiUrl, init) => {
                        const deleteRequest = (endpointUrl) => {
                            const fullUrl = apiUrl + endpointUrl;
                            return fetch(fullUrl, {
                                credentials: 'include',
                                method: 'DELETE',
                                mode: 'cors',
                                headers: { 'Content-Type': 'application/json' },
                                ...init,
                            }).then(response => {
                                if (!response.ok) {
                                    throw Error(response.statusText);
                                }
                                else {
                                    return response.json();
                                }
                            });
                        };
                        return deleteRequest;
                    };
                    const createGenericPutRequest = (apiUrl, contentType) => {
                        const putRequest = (endpointUrl, args) => {
                            const fullUrl = apiUrl + endpointUrl;
                            return fetch(fullUrl, {
                                credentials: 'include',
                                method: 'PUT',
                                mode: 'cors',
                                headers: { 'Content-Type': contentType ? contentType : 'application/json' },
                                body: JSON.stringify(args),
                            });
                        };
                        return putRequest;
                    };
                    const createPutRequest = (apiUrl, init) => {
                        const putRequest = (endpointUrl, args) => {
                            const fullUrl = apiUrl + endpointUrl;
                            return fetch(fullUrl, {
                                credentials: 'include',
                                method: 'PUT',
                                mode: 'cors',
                                headers: { 'Content-Type': 'application/json' },
                                ...init,
                                body: JSON.stringify(args),
                            }).then(response => {
                                if (!response.ok) {
                                    throw Error(response.statusText);
                                }
                                else {
                                    return response.json();
                                }
                            });
                        };
                        return putRequest;
                    };
                    const createParamString = (params, toUpperCase) => {
                        let str = '?';
                        Object.keys(params).forEach((key, index) => {
                            const param = params[key];
                            if (param === undefined || param === null || param === '') {
                                return;
                            }
                            if (toUpperCase) {
                                key = key.toUpperCase();
                            }
                            str += key + '=' + param + '&';
                        });
                        return encodeURI(str.slice(0, str.length - 1));
                    };
                    //# sourceMappingURL=index.js.map

                    /***/
}),

/***/ "./src/api.ts":
/*!********************!*\
  !*** ./src/api.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports) => {


                    Object.defineProperty(exports, "__esModule", ({ value: true }));
                    exports.ConnectionMode = void 0;
                    /**
                     * Method of connecting to message-broker server
                     * FALLBACK attempts using websockets before falling back to polling.
                     * WEBSOCKETS uses websockets or fails.
                     * POLLING uses HTTP polling or fails.
                     *
                     * Note that in polling mode, only 1 poll request will be open
                     * at a time. The configured polling frequency guarantees
                     * that no more than 1 poll request will be made within that time frame.
                     * For example, consider these two scenarios when the polling frequency is 1000ms:
                     * If Poll 1 starts at time 0 and takes 800ms, then Poll 2 starts at time 1000ms.
                     * If Poll 1 starts at time 0 and takes 1200ms, then Poll 2 starts at time 1200ms.
                     */
                    var ConnectionMode;
                    (function (ConnectionMode) {
                        ConnectionMode["FALLBACK"] = "FALLBACK";
                        ConnectionMode["WEBSOCKETS"] = "WEBSOCKETS";
                        ConnectionMode["POLLING"] = "POLLING";
                    })(ConnectionMode || (exports.ConnectionMode = ConnectionMode = {}));


                    /***/
}),

/***/ "./src/events.ts":
/*!***********************!*\
  !*** ./src/events.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


                    Object.defineProperty(exports, "__esModule", ({ value: true }));
                    exports.SystemMessages = exports.iSpyMessages = exports.RemoteMessages = void 0;
                    /**
                     * Messages that the remote client can send to the iSpy client to perform.
                     */
                    var RemoteMessages;
                    (function (RemoteMessages) {
                        RemoteMessages["REMOTE_CONNECT"] = "REMOTE_CONNECT";
                        RemoteMessages["REQUEST_STATUS"] = "REQUEST_STATUS";
                        RemoteMessages["LOAD_IMAGES"] = "LOAD_IMAGES";
                        RemoteMessages["ADD_IMAGES"] = "ADD_IMAGES";
                        RemoteMessages["SET_IMAGE"] = "SET_IMAGE";
                        RemoteMessages["GEOJSON_CREATE_SHAPES"] = "GEOJSON_CREATE_SHAPES";
                        RemoteMessages["GEOJSON_UPDATE_SHAPES"] = "GEOJSON_UPDATE_SHAPES";
                        RemoteMessages["SELECT_SHAPES"] = "SELECT_SHAPES";
                        RemoteMessages["DELETE_SHAPES"] = "DELETE_SHAPES";
                        RemoteMessages["LOAD_KML"] = "LOAD_KML";
                        RemoteMessages["CENTER_VIEWPORT"] = "CENTER_VIEWPORT";
                        RemoteMessages["ENABLE_CROSSHAIR"] = "ENABLE_CROSSHAIR";
                        RemoteMessages["GEOJSON_GET_SHAPES"] = "GEOJSON_GET_SHAPES";
                        RemoteMessages["REQUEST_VIEWPORT_IMAGE"] = "REQUEST_VIEWPORT_IMAGE";
                        RemoteMessages["FIT_IMAGE_TO_SCREEN"] = "FIT_IMAGE_TO_SCREEN";
                        // LEGACY
                        /** @deprecated use GeoJSON API */
                        RemoteMessages["CREATE_SHAPES"] = "CREATE_SHAPES";
                        /** @deprecated use GeoJSON API */
                        RemoteMessages["UPDATE_SHAPES"] = "UPDATE_SHAPES";
                        /** @deprecated use GeoJSON API */
                        RemoteMessages["GET_SHAPES"] = "GET_SHAPES";
                        /** @deprecated use LOAD_IMAGES API */
                        RemoteMessages["LOAD_IMAGE"] = "LOAD_IMAGE";
                    })(RemoteMessages || (exports.RemoteMessages = RemoteMessages = {}));
                    /**
                     * Messages that the remote client can listen for sent by the iSpy client.
                     */
                    var iSpyMessages;
                    (function (iSpyMessages) {
                        iSpyMessages["INSTANCE_CONNECT"] = "INSTANCE_CONNECT";
                        iSpyMessages["INSTANCE_DISCONNECT"] = "INSTANCE_DISCONNECT";
                        iSpyMessages["IMAGE_LOAD"] = "IMAGE_LOAD";
                        iSpyMessages["IMAGE_UNLOAD"] = "IMAGE_UNLOAD";
                        iSpyMessages["IMAGE_CLICKED"] = "IMAGE_CLICKED";
                        iSpyMessages["VIEWPORT_CHANGED"] = "VIEWPORT_CHANGED";
                        iSpyMessages["GEOJSON_SHAPE_CREATED"] = "GEOJSON_SHAPE_CREATED";
                        iSpyMessages["GEOJSON_SHAPE_UPDATED"] = "GEOJSON_SHAPE_UPDATED";
                        iSpyMessages["SHAPE_DELETED"] = "SHAPE_DELETED";
                        iSpyMessages["SHAPE_SELECTED"] = "SHAPE_SELECTED";
                        iSpyMessages["OBSERVATION_SAVED"] = "OBSERVATION_SAVED";
                        iSpyMessages["RETURN_STATUS"] = "RETURN_STATUS";
                        iSpyMessages["RETURN_SHAPES"] = "RETURN_SHAPES";
                        iSpyMessages["LAYER_CREATED"] = "LAYER_CREATED";
                        iSpyMessages["RETURN_LOAD_IMAGES"] = "RETURN_LOAD_IMAGES";
                        iSpyMessages["RETURN_ADD_IMAGES"] = "RETURN_ADD_IMAGES";
                        iSpyMessages["RETURN_SET_IMAGE"] = "RETURN_SET_IMAGE";
                        iSpyMessages["RETURN_GEOJSON_CREATE_SHAPES"] = "RETURN_GEOJSON_CREATE_SHAPES";
                        iSpyMessages["RETURN_GEOJSON_UPDATE_SHAPES"] = "RETURN_GEOJSON_UPDATE_SHAPES";
                        iSpyMessages["RETURN_SELECT_SHAPES"] = "RETURN_SELECT_SHAPES";
                        iSpyMessages["RETURN_DELETE_SHAPES"] = "RETURN_DELETE_SHAPES";
                        iSpyMessages["RETURN_LOAD_KML"] = "RETURN_LOAD_KML";
                        iSpyMessages["RETURN_CENTER_VIEWPORT"] = "RETURN_CENTER_VIEWPORT";
                        iSpyMessages["RETURN_GEOJSON_GET_SHAPES"] = "RETURN_GEOJSON_GET_SHAPES";
                        iSpyMessages["RETURN_ENABLE_CROSSHAIR"] = "RETURN_ENABLE_CROSSHAIR";
                        iSpyMessages["RETURN_VIEWPORT_IMAGE"] = "RETURN_VIEWPORT_IMAGE";
                        iSpyMessages["RETURN_FIT_IMAGE_TO_SCREEN"] = "RETURN_FIT_IMAGE_TO_SCREEN";
                        // LEGACY
                        /** @deprecated use GeoJSON API */
                        iSpyMessages["SHAPE_CREATED"] = "SHAPE_CREATED";
                        /** @deprecated use GeoJSON API */
                        iSpyMessages["SHAPE_UPDATED"] = "SHAPE_UPDATED";
                        /** @deprecated use GeoJSON API */
                        iSpyMessages["RETURN_CREATE_SHAPES"] = "RETURN_CREATE_SHAPES";
                        /** @deprecated use GeoJSON API */
                        iSpyMessages["RETURN_UPDATE_SHAPES"] = "RETURN_UPDATE_SHAPES";
                        /** @deprecated use GeoJSON API */
                        iSpyMessages["RETURN_GET_SHAPES"] = "RETURN_GET_SHAPES";
                    })(iSpyMessages || (exports.iSpyMessages = iSpyMessages = {}));
                    var SystemMessages;
                    (function (SystemMessages) {
                        SystemMessages["SYSTEM_MESSAGE"] = "SYSTEM_MESSAGE";
                        SystemMessages["SYSTEM_DISCONNECT"] = "SYSTEM_DISCONNECT";
                    })(SystemMessages || (exports.SystemMessages = SystemMessages = {}));


                    /***/
}),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function (__unused_webpack_module, exports, __webpack_require__) {


                    var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
                        if (k2 === undefined) k2 = k;
                        var desc = Object.getOwnPropertyDescriptor(m, k);
                        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
                            desc = { enumerable: true, get: function () { return m[k]; } };
                        }
                        Object.defineProperty(o, k2, desc);
                    }) : (function (o, m, k, k2) {
                        if (k2 === undefined) k2 = k;
                        o[k2] = m[k];
                    }));
                    var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
                        Object.defineProperty(o, "default", { enumerable: true, value: v });
                    }) : function (o, v) {
                        o["default"] = v;
                    });
                    var __importStar = (this && this.__importStar) || (function () {
                        var ownKeys = function (o) {
                            ownKeys = Object.getOwnPropertyNames || function (o) {
                                var ar = [];
                                for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
                                return ar;
                            };
                            return ownKeys(o);
                        };
                        return function (mod) {
                            if (mod && mod.__esModule) return mod;
                            var result = {};
                            if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
                            __setModuleDefault(result, mod);
                            return result;
                        };
                    })();
                    Object.defineProperty(exports, "__esModule", ({ value: true }));
                    exports.RemoteEvents = exports.SocketAPI = exports.RemoteTypes = exports.RemoteInterface = void 0;
                    var interface_1 = __webpack_require__(/*! ./interface */ "./src/interface.ts");
                    Object.defineProperty(exports, "RemoteInterface", ({ enumerable: true, get: function () { return interface_1.RemoteInterface; } }));
                    var RemoteTypes = __importStar(__webpack_require__(/*! ./api */ "./src/api.ts"));
                    exports.RemoteTypes = RemoteTypes;
                    var SocketAPI = __importStar(__webpack_require__(/*! ./socket */ "./src/socket.ts"));
                    exports.SocketAPI = SocketAPI;
                    var RemoteEvents = __importStar(__webpack_require__(/*! ./events */ "./src/events.ts"));
                    exports.RemoteEvents = RemoteEvents;


                    /***/
}),

/***/ "./src/interface.ts":
/*!**************************!*\
  !*** ./src/interface.ts ***!
  \**************************/
/***/ (function (__unused_webpack_module, exports, __webpack_require__) {


                    var __assign = (this && this.__assign) || function () {
                        __assign = Object.assign || function (t) {
                            for (var s, i = 1, n = arguments.length; i < n; i++) {
                                s = arguments[i];
                                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                                    t[p] = s[p];
                            }
                            return t;
                        };
                        return __assign.apply(this, arguments);
                    };
                    var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
                        if (k2 === undefined) k2 = k;
                        var desc = Object.getOwnPropertyDescriptor(m, k);
                        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
                            desc = { enumerable: true, get: function () { return m[k]; } };
                        }
                        Object.defineProperty(o, k2, desc);
                    }) : (function (o, m, k, k2) {
                        if (k2 === undefined) k2 = k;
                        o[k2] = m[k];
                    }));
                    var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
                        Object.defineProperty(o, "default", { enumerable: true, value: v });
                    }) : function (o, v) {
                        o["default"] = v;
                    });
                    var __importStar = (this && this.__importStar) || (function () {
                        var ownKeys = function (o) {
                            ownKeys = Object.getOwnPropertyNames || function (o) {
                                var ar = [];
                                for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
                                return ar;
                            };
                            return ownKeys(o);
                        };
                        return function (mod) {
                            if (mod && mod.__esModule) return mod;
                            var result = {};
                            if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
                            __setModuleDefault(result, mod);
                            return result;
                        };
                    })();
                    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
                        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
                        return new (P || (P = Promise))(function (resolve, reject) {
                            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
                            step((generator = generator.apply(thisArg, _arguments || [])).next());
                        });
                    };
                    var __generator = (this && this.__generator) || function (thisArg, body) {
                        var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
                        return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
                        function verb(n) { return function (v) { return step([n, v]); }; }
                        function step(op) {
                            if (f) throw new TypeError("Generator is already executing.");
                            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                                if (y = 0, t) op = [op[0] & 2, t.value];
                                switch (op[0]) {
                                    case 0: case 1: t = op; break;
                                    case 4: _.label++; return { value: op[1], done: false };
                                    case 5: _.label++; y = op[1]; op = [0]; continue;
                                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                                    default:
                                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                                        if (t[2]) _.ops.pop();
                                        _.trys.pop(); continue;
                                }
                                op = body.call(thisArg, _);
                            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
                            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
                        }
                    };
                    Object.defineProperty(exports, "__esModule", ({ value: true }));
                    exports.ConnectionMode = exports.RemoteInterface = void 0;
                    var api_1 = __webpack_require__(/*! ./api */ "./src/api.ts");
                    Object.defineProperty(exports, "ConnectionMode", ({ enumerable: true, get: function () { return api_1.ConnectionMode; } }));
                    var events_1 = __webpack_require__(/*! ./events */ "./src/events.ts");
                    var SocketAPI = __importStar(__webpack_require__(/*! ./socket */ "./src/socket.ts"));
                    var connected = false;
                    var RemoteInterface = /** @class */ (function () {
                        function RemoteInterface() {
                            this.__version = '2.26.2-1';
                            this.__warnings_enabled = false;
                            this.__promise_timeout_ms = 1000 * 60; // 1 minute in ms
                        }
                        /**
                         * connect must be called before publishing or receiving any messages.
                         *
                         * @param {string} brokerURL - the URL for the CGSWeb Pub Sub Server
                         * @param {ConnectionMode string)} connectionMode - The method of publishing/receiving messages
                         * @param {{pollingFrequency: number, group?: string}} connectionOptions - additional options for connecting:
                         *
                         *      pollingFrequency - the polling frequency in ms when connection mode is set to "POLLING"
                         *
                         *      group? - The group channel to publish/receive messages on
                         *
                         * @return {boolean} true if we successfully set up, false otherwise
                         */
                        RemoteInterface.prototype.connect = function (brokerURL_1, connectionMode_1) {
                            return __awaiter(this, arguments, void 0, function (brokerURL, connectionMode, connectionOptions) {
                                var success;
                                var _this = this;
                                if (connectionOptions === void 0) { connectionOptions = { pollingFrequency: 4000 }; }
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            // Do not let the user call connect multiple times
                                            if (connected) {
                                                this.disconnect();
                                            }
                                            return [4 /*yield*/, SocketAPI.connect(brokerURL, connectionMode, connectionOptions)];
                                        case 1:
                                            success = _a.sent();
                                            if (!success) {
                                                return [2 /*return*/, false];
                                            }
                                            SocketAPI.publish(events_1.RemoteMessages.REMOTE_CONNECT, { remoteVersion: this.__version });
                                            SocketAPI.subscribe(events_1.SystemMessages.SYSTEM_DISCONNECT, function () {
                                                _this.disconnect();
                                                console.warn('(Disconnected) iSpy Remote interface received disconnect message from server.');
                                            });
                                            return [2 /*return*/, true];
                                    }
                                });
                            });
                        };
                        RemoteInterface.prototype.autoConnect = function (brokerURL, connectionMode, connectionOptions) {
                            var _this = this;
                            if (connectionOptions === void 0) { connectionOptions = { pollingFrequency: 4000 }; }
                            return new Promise(function (resolve, reject) {
                                _this.connect(brokerURL, connectionMode, connectionOptions)
                                    .then(function () {
                                        var consub = SocketAPI.subscribe(events_1.iSpyMessages.INSTANCE_CONNECT, function (p) {
                                            consub.unsubscribe();
                                            resolve({
                                                instanceID: p.instanceID,
                                                iSpyVersion: p.iSpyVersion,
                                                imageID: '',
                                                imagePath: '',
                                                imageGuide: ''
                                            });
                                        });
                                        _this.requestStatus()
                                            .then(function (p) {
                                                consub.unsubscribe();
                                                resolve(p);
                                            })
                                            .catch(function (e) { return reject(e); });
                                        setTimeout(function () {
                                            consub.unsubscribe();
                                            reject('No iSpy instance connected');
                                        }, 60 * 1000);
                                    })
                                    .catch(function (e) {
                                        _this.disconnect();
                                    });
                            });
                        };
                        RemoteInterface.prototype.disconnect = function () {
                            SocketAPI.disconnect();
                            return true;
                        };
                        RemoteInterface.prototype.requestStatus = function (payload) {
                            if (payload === void 0) { payload = {}; }
                            if (payload && payload.instanceID) {
                                var intent = createIntent();
                                SocketAPI.publish(events_1.RemoteMessages.REQUEST_STATUS, decorate(payload, intent, this.__version));
                                return promisify(events_1.iSpyMessages.RETURN_STATUS, this.__promise_timeout_ms, intent);
                            }
                            else {
                                SocketAPI.publish(events_1.RemoteMessages.REQUEST_STATUS, payload);
                                return promisify(events_1.iSpyMessages.RETURN_STATUS, this.__promise_timeout_ms);
                            }
                        };
                        RemoteInterface.prototype.requestViewportImage = function (payload) {
                            if (payload === void 0) { payload = {}; }
                            var intent = createIntent();
                            SocketAPI.publish(events_1.RemoteMessages.REQUEST_VIEWPORT_IMAGE, decorate(payload, intent, this.__version));
                            return promisify(events_1.iSpyMessages.RETURN_VIEWPORT_IMAGE, this.__promise_timeout_ms, intent);
                        };
                        RemoteInterface.prototype.loadImages = function (payload) {
                            var intent = createIntent();
                            SocketAPI.publish(events_1.RemoteMessages.LOAD_IMAGES, decorate(payload, intent, this.__version));
                            return promisify(events_1.iSpyMessages.RETURN_LOAD_IMAGES, this.__promise_timeout_ms, intent);
                        };
                        RemoteInterface.prototype.addImages = function (payload) {
                            var intent = createIntent();
                            SocketAPI.publish(events_1.RemoteMessages.ADD_IMAGES, decorate(payload, intent, this.__version));
                            return promisify(events_1.iSpyMessages.RETURN_ADD_IMAGES, this.__promise_timeout_ms, intent);
                        };
                        RemoteInterface.prototype.setImage = function (payload) {
                            var intent = createIntent();
                            SocketAPI.publish(events_1.RemoteMessages.SET_IMAGE, decorate(payload, intent, this.__version));
                            return promisify(events_1.iSpyMessages.RETURN_SET_IMAGE, this.__promise_timeout_ms, intent);
                        };
                        RemoteInterface.prototype.createShapes = function (payload) {
                            var intent = createIntent();
                            SocketAPI.publish(events_1.RemoteMessages.GEOJSON_CREATE_SHAPES, decorate(payload, intent, this.__version));
                            return promisify(events_1.iSpyMessages.RETURN_GEOJSON_CREATE_SHAPES, this.__promise_timeout_ms, intent);
                        };
                        RemoteInterface.prototype.selectShapes = function (payload) {
                            var intent = createIntent();
                            SocketAPI.publish(events_1.RemoteMessages.SELECT_SHAPES, decorate(payload, intent, this.__version));
                            return promisify(events_1.iSpyMessages.RETURN_SELECT_SHAPES, this.__promise_timeout_ms, intent);
                        };
                        RemoteInterface.prototype.updateShapes = function (payload) {
                            var intent = createIntent();
                            SocketAPI.publish(events_1.RemoteMessages.GEOJSON_UPDATE_SHAPES, decorate(payload, intent, this.__version));
                            return promisify(events_1.iSpyMessages.RETURN_GEOJSON_UPDATE_SHAPES, this.__promise_timeout_ms, intent);
                        };
                        RemoteInterface.prototype.deleteShapes = function (payload) {
                            var intent = createIntent();
                            SocketAPI.publish(events_1.RemoteMessages.DELETE_SHAPES, decorate(payload, intent, this.__version));
                            return promisify(events_1.iSpyMessages.RETURN_DELETE_SHAPES, this.__promise_timeout_ms, intent);
                        };
                        RemoteInterface.prototype.getShapes = function (query) {
                            return __awaiter(this, void 0, void 0, function () {
                                var intent;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    intent = createIntent();
                                    // 2.1.7 patch (.intent vs .__intent)
                                    SocketAPI.publish(events_1.RemoteMessages.GEOJSON_GET_SHAPES, withIntent(__assign(__assign({}, query), { intent: intent }), intent));
                                    return [2 /*return*/, new Promise(function (resolve, reject) {
                                        promisify(events_1.iSpyMessages.RETURN_GEOJSON_GET_SHAPES, _this.__promise_timeout_ms, intent)
                                            .then(resolve)
                                            .catch(reject);
                                        // 2.1.7 patch (RETURN_SHAPES vs RETURN_SHAPES__INTENT)
                                        setTimeout(function () { return reject("No iSpy instance has responded to getShapes with intent: ".concat(intent)); }, _this.__promise_timeout_ms);
                                        var stream = SocketAPI.subscribe(events_1.iSpyMessages.RETURN_SHAPES, function (payload) {
                                            if (payload.intent === intent) {
                                                stream.unsubscribe();
                                                resolve(payload);
                                            }
                                            else {
                                                if (_this.__warnings_enabled) {
                                                    console.warn("Unexpected Message Intent: expected ".concat(intent, ", received ").concat(payload.intent));
                                                }
                                            }
                                        });
                                    })];
                                });
                            });
                        };
                        RemoteInterface.prototype.loadKml = function (payload) {
                            var intent = createIntent();
                            SocketAPI.publish(events_1.RemoteMessages.LOAD_KML, decorate(payload, intent, this.__version));
                            return promisify(events_1.iSpyMessages.RETURN_LOAD_KML, this.__promise_timeout_ms, intent);
                        };
                        RemoteInterface.prototype.setViewportCenter = function (payload) {
                            var intent = createIntent();
                            SocketAPI.publish(events_1.RemoteMessages.CENTER_VIEWPORT, decorate(payload, intent, this.__version));
                            return promisify(events_1.iSpyMessages.RETURN_CENTER_VIEWPORT, this.__promise_timeout_ms, intent);
                        };
                        RemoteInterface.prototype.setFitImageToScreen = function (payload) {
                            var intent = createIntent();
                            SocketAPI.publish(events_1.RemoteMessages.FIT_IMAGE_TO_SCREEN, decorate(payload, intent, this.__version));
                            return promisify(events_1.iSpyMessages.RETURN_FIT_IMAGE_TO_SCREEN, this.__promise_timeout_ms, intent);
                        };
                        RemoteInterface.prototype.setCrosshairEnabled = function (payload) {
                            var intent = createIntent();
                            SocketAPI.publish(events_1.RemoteMessages.ENABLE_CROSSHAIR, decorate(payload, intent, this.__version));
                            return promisify(events_1.iSpyMessages.RETURN_ENABLE_CROSSHAIR, this.__promise_timeout_ms, intent);
                        };
                        RemoteInterface.prototype.onConnection = function (callback) {
                            SocketAPI.subscribe(events_1.iSpyMessages.INSTANCE_CONNECT, callback);
                            return true;
                        };
                        RemoteInterface.prototype.onDisconnection = function (callback) {
                            SocketAPI.subscribe(events_1.iSpyMessages.INSTANCE_DISCONNECT, callback);
                            return true;
                        };
                        RemoteInterface.prototype.onImageLoad = function (callback) {
                            SocketAPI.subscribe(events_1.iSpyMessages.IMAGE_LOAD, callback);
                            return true;
                        };
                        RemoteInterface.prototype.onImageUnload = function (callback) {
                            SocketAPI.subscribe(events_1.iSpyMessages.IMAGE_UNLOAD, callback);
                            return true;
                        };
                        RemoteInterface.prototype.onImageClicked = function (callback) {
                            SocketAPI.subscribe(events_1.iSpyMessages.IMAGE_CLICKED, callback);
                            return true;
                        };
                        RemoteInterface.prototype.onViewportChanged = function (callback) {
                            SocketAPI.subscribe(events_1.iSpyMessages.VIEWPORT_CHANGED, callback);
                            return true;
                        };
                        RemoteInterface.prototype.onLayerCreated = function (callback) {
                            SocketAPI.subscribe(events_1.iSpyMessages.LAYER_CREATED, callback);
                            return true;
                        };
                        /** SOM observation subscription */
                        RemoteInterface.prototype.onObservationSaved = function (callback) {
                            SocketAPI.subscribe(events_1.iSpyMessages.OBSERVATION_SAVED, callback);
                            return true;
                        };
                        RemoteInterface.prototype.onShapeCreated = function (callback) {
                            SocketAPI.subscribe(events_1.iSpyMessages.GEOJSON_SHAPE_CREATED, callback);
                            return true;
                        };
                        RemoteInterface.prototype.onShapeUpdated = function (callback) {
                            SocketAPI.subscribe(events_1.iSpyMessages.GEOJSON_SHAPE_UPDATED, callback);
                            return true;
                        };
                        RemoteInterface.prototype.onShapeDeleted = function (callback) {
                            SocketAPI.subscribe(events_1.iSpyMessages.SHAPE_DELETED, callback);
                            return true;
                        };
                        RemoteInterface.prototype.onShapeSelected = function (callback) {
                            SocketAPI.subscribe(events_1.iSpyMessages.SHAPE_SELECTED, callback);
                            return true;
                        };
                        RemoteInterface.prototype.onStatus = function (callback) {
                            SocketAPI.subscribe(events_1.iSpyMessages.RETURN_STATUS, callback);
                            return true;
                        };
                        RemoteInterface.prototype.onSystemMessage = function (callback) {
                            SocketAPI.subscribe(events_1.SystemMessages.SYSTEM_MESSAGE, callback);
                            return true;
                        };
                        RemoteInterface.prototype.onSystemDisconnect = function (callback) {
                            SocketAPI.subscribe(events_1.SystemMessages.SYSTEM_DISCONNECT, callback);
                            return true;
                        };
                        return RemoteInterface;
                    }());
                    function promisify(message, timeout, intent) {
                        return new Promise(function (resolve, reject) {
                            setTimeout(function () { return reject("No iSpy instance has responded to ".concat(message, " ").concat(intent ? "with intent: ".concat(intent) : '')); }, timeout);
                            var stream = SocketAPI.subscribe(intent ? SocketAPI.createReturnMessage(message, intent) : message, function (p) {
                                stream.unsubscribe();
                                if (p.__error) {
                                    reject(p.__error);
                                }
                                else {
                                    resolve(p);
                                }
                            });
                        });
                    }
                    function createIntent() {
                        return String(Math.floor(Math.random() * 10000));
                    }
                    function withIntent(o, intent) {
                        if (!o) {
                            return { __intent: intent };
                        }
                        return __assign(__assign({}, o), { __intent: intent });
                    }
                    function withVersion(o, version) {
                        if (!o) {
                            return { __version: version };
                        }
                        return __assign(__assign({}, o), { __version: version });
                    }
                    function decorate(o, intent, version) {
                        return withIntent(withVersion(o, version), intent);
                    }
                    var iSpyRemoteInterface = new RemoteInterface();
                    exports.RemoteInterface = iSpyRemoteInterface;


                    /***/
}),

/***/ "./src/socket.ts":
/*!***********************!*\
  !*** ./src/socket.ts ***!
  \***********************/
/***/ (function (__unused_webpack_module, exports, __webpack_require__) {


                    var __assign = (this && this.__assign) || function () {
                        __assign = Object.assign || function (t) {
                            for (var s, i = 1, n = arguments.length; i < n; i++) {
                                s = arguments[i];
                                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                                    t[p] = s[p];
                            }
                            return t;
                        };
                        return __assign.apply(this, arguments);
                    };
                    var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
                        if (k2 === undefined) k2 = k;
                        var desc = Object.getOwnPropertyDescriptor(m, k);
                        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
                            desc = { enumerable: true, get: function () { return m[k]; } };
                        }
                        Object.defineProperty(o, k2, desc);
                    }) : (function (o, m, k, k2) {
                        if (k2 === undefined) k2 = k;
                        o[k2] = m[k];
                    }));
                    var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
                        Object.defineProperty(o, "default", { enumerable: true, value: v });
                    }) : function (o, v) {
                        o["default"] = v;
                    });
                    var __importStar = (this && this.__importStar) || (function () {
                        var ownKeys = function (o) {
                            ownKeys = Object.getOwnPropertyNames || function (o) {
                                var ar = [];
                                for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
                                return ar;
                            };
                            return ownKeys(o);
                        };
                        return function (mod) {
                            if (mod && mod.__esModule) return mod;
                            var result = {};
                            if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
                            __setModuleDefault(result, mod);
                            return result;
                        };
                    })();
                    var __importDefault = (this && this.__importDefault) || function (mod) {
                        return (mod && mod.__esModule) ? mod : { "default": mod };
                    };
                    Object.defineProperty(exports, "__esModule", ({ value: true }));
                    exports._socket = void 0;
                    exports.connect = connect;
                    exports.disconnect = disconnect;
                    exports.publish = publish;
                    exports.publishError = publishError;
                    exports.subscribe = subscribe;
                    exports.createReturnMessage = createReturnMessage;
                    var http_1 = __importDefault(__webpack_require__(/*! @cgsweb/core/lib/events/socket/data-providers/http */ "./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/events/socket/data-providers/http/index.js"));
                    var websocket_1 = __importStar(__webpack_require__(/*! @cgsweb/core/lib/events/socket/data-providers/websocket */ "./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/events/socket/data-providers/websocket/index.js"));
                    var socket_1 = __importDefault(__webpack_require__(/*! @cgsweb/core/lib/events/socket */ "./node_modules/.pnpm/@cgsweb+core@2.26.2-3_@cgsweb+types@2.26.2-0_@types+react@19.1.10_autobind-decorator@2.4.0_bo_lunpvqsje5okqiyg5zegw6bx4a/node_modules/@cgsweb/core/lib/events/socket/index.js"));
                    var api_1 = __webpack_require__(/*! ./api */ "./src/api.ts");
                    var _socket;
                    var lastRequestDate = Date.now();
                    var group;
                    function connect(url, connectionMode, connectionOptions) {
                        if (connectionOptions === void 0) { connectionOptions = { pollingFrequency: 4000 }; }
                        group = typeof connectionOptions.group === 'string' ? connectionOptions.group : undefined;
                        var dataProvider;
                        var httpOptions = {
                            pollUrl: "".concat(url, "/api/rest/poll"),
                            publishUrl: "".concat(url, "/api/rest/publish"),
                            intervalMS: connectionOptions.pollingFrequency,
                            pollRequestOptions: {
                                credentials: 'include'
                            },
                            publishRequestOptions: {
                                credentials: 'include',
                                headers: { 'Content-Type': 'application/json' }
                            },
                            getQueryParams: function () { return ({ startTimestamp: lastRequestDate }); },
                            messagesSelector: function (data) {
                                // Try to base our polling time on server time only
                                lastRequestDate = data.timestamp ? data.timestamp : Date.now();
                                return data.messages;
                            }
                        };
                        var secured = url.indexOf('https') !== -1;
                        var socketUrl = "".concat(url.replace(secured ? 'https' : 'http', secured ? 'wss' : 'ws'), "/socket");
                        var socketOptions = {
                            socketUrl: socketUrl,
                            messagesSelector: function (data) { return [data]; }
                        };
                        if (connectionMode === api_1.ConnectionMode.WEBSOCKETS) {
                            dataProvider = (0, websocket_1.default)(socketOptions);
                        }
                        else if (connectionMode === api_1.ConnectionMode.POLLING) {
                            dataProvider = (0, http_1.default)(httpOptions);
                        }
                        else {
                            dataProvider = (0, websocket_1.websocketFallbackDataProvider)({ http: httpOptions, socket: socketOptions });
                        }
                        exports._socket = _socket = (0, socket_1.default)({
                            dataProvider: dataProvider,
                            typeSelector: function (message) { return message.messageType; },
                            messageTransformer: function (message) { return (__assign(__assign({}, message), { payload: message.payload })); }
                        });
                        return _socket
                            .connect()
                            .then(function () { return true; })
                            .catch(function () { return false; });
                    }
                    function disconnect() {
                        group = undefined;
                        if (_socket) {
                            _socket.disconnect();
                        }
                    }
                    function publish(message, payload) {
                        return _socket.publish({
                            messageType: message,
                            payload: payload,
                            groupName: group
                        });
                    }
                    function publishError(message, payload) {
                        return _socket.publish({
                            messageType: message,
                            payload: payload
                        });
                    }
                    function subscribe(message, callback) {
                        // Cache of received messages so we don't process duplicates
                        var receivedMessages = [];
                        return _socket.on(message).subscribe(function (p) {
                            if (receivedMessage(receivedMessages, p))
                                return;
                            if (p.groupName !== group)
                                return;
                            callback(p.payload);
                        });
                    }
                    function createReturnMessage(message, intent) {
                        return intent ? "".concat(message, "__").concat(intent) : message;
                    }
                    function receivedMessage(receivedMessages, p) {
                        if (receivedMessages.indexOf(p.uuid) === -1) {
                            if (receivedMessages.length > 32) {
                                receivedMessages.splice(0, receivedMessages.length);
                            }
                            receivedMessages.push(p.uuid);
                            return false;
                        }
                        else {
                            return true;
                        }
                    }


                    /***/
})

            /******/
});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
                /******/
}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
                /******/
};
/******/
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
            /******/
}
/******/
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for (var key in definition) {
/******/ 				if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
                        /******/
}
                    /******/
}
                /******/
};
            /******/
})();
/******/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
            /******/
})();
/******/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
                    /******/
}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
                /******/
};
            /******/
})();
/******/
/************************************************************************/
/******/
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/
/******/ 	return __webpack_exports__;
        /******/
})()
        ;
});
//# sourceMappingURL=ispy-remote-interface.js.map