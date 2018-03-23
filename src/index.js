import { Observable } from "rxjs/Rx";

const startButton = document.querySelector("#start");
const stopButton = document.querySelector("#stop");
const resetButton = document.querySelector("#reset");
const halfButton = document.querySelector("#half");
const quarterButton = document.querySelector("#quarter");

const start$ = Observable.fromEvent(startButton, "click");
const stop$ = Observable.fromEvent(stopButton, "click");
const reset$ = Observable.fromEvent(resetButton, "click");
const half$ = Observable.fromEvent(halfButton, "click");
const quarter$ = Observable.fromEvent(quarterButton, "click");

const data = { count: 0 };
const inc = acc => ({ count: acc.count + 1 });
const reset = acc => data;

const interval$ = Observable.interval(1000);
const intervalThatStop$ = interval$.takeUntil(stop$);

const incOrReset$ = Observable.merge(
  intervalThatStop$.mapTo(inc),
  reset$.mapTo(reset)
);

Observable.merge(start$.mapTo(1000), half$.mapTo(500), quarter$.mapTo(250))
  .switchMap(time =>
    Observable.merge(
      Observable.interval(time)
        .takeUntil(stop$)
        .mapTo(inc),
      reset$.mapTo(reset)
    )
  )
  .startWith(data)
  .scan((acc, cur) => cur(acc))
  .subscribe(x => console.log(x));
