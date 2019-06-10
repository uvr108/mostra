import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private subject: Subject<MessageEvent>;
  private subjectData: Subject<number>;

  public connect(url: string): Subject<MessageEvent> {
      if (!this.subject) {
          this.subject = this.create(url);
      }
      return this.subject;
  }

  private create(url: string): Subject<MessageEvent> {

      const ws = new WebSocket(url);
      console.log('Conexión a ');
      console.log(url);

      const observable = Observable.create(
          (obs: Observer<MessageEvent>) => {
              ws.onmessage = obs.next.bind(obs);
              ws.onerror = obs.error.bind(obs);
              ws.onclose = obs.complete.bind(obs);

              return ws.close.bind(ws);
          }
      );
      const observer = {
          next: (data: Object) => {
              if (ws.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify(data));
                  // console.log('data : ', JSON.stringify(data));
              }
          }
      };

      return Subject.create(observer, observable);
  }

  constructor() { }
}
