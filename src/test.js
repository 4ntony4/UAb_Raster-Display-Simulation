import { lineMP } from './lineMP.mjs';

function test() {
    let P, Q, R;

    P = {x: 0, y: 0};
    Q = {x: 3, y: 1};
    R = lineMP(P, Q);
    console.log(R);

    P = {x: -5, y: -2};
    Q = {x: 2, y: 5};
    R = lineMP(P, Q);
    console.log(R);

    P = {x: 6, y: 10};
    Q = {x: 13, y: 17};
    R = lineMP(P, Q);
    console.log(R);
}

export { test };