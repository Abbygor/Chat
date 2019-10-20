import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Mensaje } from '../interfaces/mensaje.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  public chats: Mensaje[] = [];

  public usuario: any = {};

  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  items: Observable<Mensaje[]>;

  constructor(private afs: AngularFirestore,
    public afAuth: AngularFireAuth) {
      this.afAuth.authState.subscribe(user => {
        if(!user){
          return;
        }
        this.usuario.nombre = user.displayName;
        this.usuario.uid = user.uid;
      });
  }
  
  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }
  
  cargarMensajes() {
    this.itemsCollection = this.afs.collection<Mensaje>('chats', 
      ref => ref.orderBy('fecha','desc')
      .limit(5));
    return this.itemsCollection.valueChanges().pipe(map((mensajes: Mensaje[]) => {
      console.log(mensajes);
      //this.chats = mensajes;
      this.chats = [];
      for (let mensaje of mensajes) {
        this.chats.unshift(mensaje);
      }
      return this.chats;
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
