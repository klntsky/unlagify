(() => {
    let counter = 0;
    let fps = 0;
    const original = window._unlagify_real_requestAnimationFrame = window['requestAnimationFrame'];
    let requests = [];

    const processRequests = () => {
        const reqsCountAtStart = requests.length;
        console.log('processRequests', requests.length);
        const timeNow = performance.now();

        for (let value of requests.slice()) {
            try {
                value(timeNow);
            } catch (e) {
                console.log(e);
            } finally {
            }
        }

        requests = requests.slice(reqsCountAtStart);
        // original(processRequests);
    };

    requestAnimationFrame = (callback) => {
        console.log('requestAnimationFrame');
        requests.push(callback);
        // original(processRequests);
    };

    setInterval(processRequests, 300);
})();
