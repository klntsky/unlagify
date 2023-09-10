(() => {
    // counter for unique animation frame request IDs
    let counter = 0;

    // FPS counter
    let fps = 0;
    const originalRequestAnimationFrame = window._unlagify_real_requestAnimationFrame = window['requestAnimationFrame'];

    // A map that contains animation frame requests. IDs are keys.
    let requests = new Map();

    // A new event loop implementation
    const processRequests = () => {
        const reqsCountAtStart = requests.length;
        const timeNow = performance.now();

        for (let [key, value] of Array.from(requests.entries())) {
            try {
                // process the request
                value(timeNow);
            } catch (e) {
                // TODO: rethrow properly
                console.error(e);
            } finally {
                requests.delete(key);
            }
        }
    };

    requestAnimationFrame = (callback) => {
        requests.set(counter++, callback);
    };

    cancelAnimationFrame = id => {
        requests.delete(id);
    };

    setInterval(processRequests, 300);

    {
        let lastFPS = 0;
        let lastTime = performance.now();

        const updateFPS = () => {
            const nowTime = performance.now();
            if (nowTime - lastTime >= 1000) {
                fps = lastFPS;
            lastFPS = 0;
                lastTime = nowTime;
                console.log('fps', fps);
            } else {
                lastFPS++;
            }
        };

        const updateFPSLoop = () => {
            updateFPS();
            originalRequestAnimationFrame(updateFPSLoop);
        };

        updateFPSLoop();
    }

})();
