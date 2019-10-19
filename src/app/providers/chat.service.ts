import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Mensaje } from '../interfaces/mensaje.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  public chats: Mensaje[] = [];

  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  items: Observable<Mensaje[]>;

  constructor(private afs: AngularFirestore) {
  }

  
  cargarMensajes() {
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha','asc'));
    return this.itemsCollection.valueChanges().pipe(map((mensajes: Mensaje[]) => {
      console.log(mensajes);
      this.chats = mensajes;
    }));
  }

  agregarMensaje(texto: string) {
    //TODO Falta el uid del usuario
    let mensaje: Mensaje = {
      nombre: "FereDemo",
      mensaje: texto,
      fecha: new Date().getTime(),
    };

    return this.itemsCollection.add(mensaje);
  }


}
