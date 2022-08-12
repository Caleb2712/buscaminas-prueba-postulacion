import {Component, OnInit} from '@angular/core';
import Swal from "sweetalert2";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'buscaminas';
  rows = 10;
  columns = 10;
  bombs = 10;

  tablero = [];

  inGame = true;
  gameStarted = false;

  constructor() {
  }

  ngOnInit(): void {
    this.newGame();
  }

  newGame(): void {
    this.resetValues();
    this.generateDashboard();
    this.addClickEvents();
    this.generateDashboardGame();
    this.refreshDashboard();
  }

  resetValues(): void {
    this.inGame = true;
    this.gameStarted = false;
  }

  generateDashboard(): void {
    let html = '';
    for (let r = 0; r < this.rows; r++) {
      html += '<tr>'
      for (let c = 0; c < this.columns; c++) {
        html += '<td id="celda-'+c+'-'+r+'" class="size">'
        html += '</td>'
      }
      html += '</tr>'
    }
    const tableroHTML = document.getElementById("tabla");
    // @ts-ignore
    tableroHTML.innerHTML = html;
    // @ts-ignore
    tableroHTML.style.background = 'slategrey';
  }

  generateDashboardGame(): void {
    this.emptyBoard();
    this.putBombs();
    this.bombCounter();
  }

  emptyBoard(): void {
    this.tablero = [];
    for (let i = 0; i < this.rows; i++) {
      // @ts-ignore
      this.tablero.push([]);
    }
  }

  putBombs(): void {
    for (let i = 0; i < this.bombs; i++) {
      let c;
      let r;
      do {
        c = Math.floor(Math.random() * this.columns);
        r = Math.floor(Math.random() * this.rows);
      } while (this.tablero[c][r]);
      // @ts-ignore
      this.tablero[c][r] = {value: -1};
    }
  }

  bombCounter(): void {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (!this.tablero[c][r]) {
          let counter= 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (i == 0 && j == 0) {
                continue;
              }
              try {
                // @ts-ignore
                if (this.tablero[c+i][r+j].value == -1) {
                  counter ++;
                }
              } catch(e) { }
            }
          }
          // @ts-ignore
          this.tablero[c][r] = {value: counter};
        }
      }
    }
  }

  refreshDashboard(): void {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        let celda = document.getElementById('celda-'+c+'-'+r);
        // @ts-ignore
        if (this.tablero[c][r].state == 'show'){
          // @ts-ignore
          celda.style.boxShadow = 'none'
          // @ts-ignore
          switch (this.tablero[c][r].value) {
            case -1:
              // @ts-ignore
              celda.innerHTML = '<i class="fas fa-bomb fa-lg"></i>';
              // @ts-ignore
              celda.style.color = 'black'
              // @ts-ignore
              celda.style.background = 'white'
              break;
            case 0:
              break;
            default:
              // @ts-ignore
              celda.innerHTML = this.tablero[c][r].value;
              break;
          }
        }
        // @ts-ignore
        if (this.tablero[c][r].state == 'marked'){
          // @ts-ignore
          celda.innerHTML = '<i class="fas fa-flag"></i>';
          // @ts-ignore
          celda.style.background = 'cadetblue';
        }
        // @ts-ignore
        if (this.tablero[c][r].state == undefined){
          // @ts-ignore
          celda.innerHTML = '';
          // @ts-ignore
          celda.style.background = '';
        }
      }
    }
    this.winGame();
    this.loseGame();
  }

  addClickEvents(): void {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        let celda = document.getElementById('celda-'+c+'-'+r);
        // @ts-ignore
        celda.addEventListener('dblclick', me => {
          this.doubleClick(celda, c, r, me);
        });
        // @ts-ignore
        celda.addEventListener('mouseup', me => {
          this.oneClick(celda, c, r, me);
        });
      }
    }
  }

  oneClick(celda: any, c: any, r: any, me: any) {
    if (!this.inGame){
      return;
    }
    // @ts-ignore
    if (this.tablero[c][r].state == 'show') {
      return;
    }
    switch (me.button) {
      case 0:
        // @ts-ignore
        if (this.tablero[c][r].state == 'marked'){
          break;
        }
        // @ts-ignore
        this.tablero[c][r].state = 'show';
        this.gameStarted = true;
        // @ts-ignore
        if (this.tablero[c][r].value == 0) {
          this.openArea(c, r);
        }
        break;
      case 1:
        break;
      case 2:
        // @ts-ignore
        if (this.tablero[c][r].state == 'marked') {
          // @ts-ignore
          this.tablero[c][r].state = undefined;
        } else {
          // @ts-ignore
          this.tablero[c][r].state = 'marked'
        }
        break;
      default:
        break;
    }
    this.refreshDashboard();
  }

  doubleClick(celda: any, c: any, r: any, me: any): void {
    if (!this.inGame) {
      return;
    }
    this.refreshDashboard();
  }

  winGame(): void {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        // @ts-ignore
        if (this.tablero[c][r].state != 'show') {
          // @ts-ignore
          if (this.tablero[c][r].value == -1) {
            continue;
          } else {
            return;
          }
        }
      }
    }
    let tableroHTML = document.getElementById('tabla');
    // @ts-ignore
    tableroHTML.style.background = 'green';
    this.inGame = false;
    Swal.fire({
      title: '¡Ganaste!',
      icon: 'success',
      confirmButtonText: 'Jugar Otra Vez',
      confirmButtonColor: '#3085d6',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }).then(() => {
      this.newGame();
    });
  }

  loseGame(): void {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        // @ts-ignore
        if (this.tablero[c][r].value == -1){
          // @ts-ignore
          if (this.tablero[c][r].state == 'show'){
            let tableroHTML = document.getElementById('tabla');
            // @ts-ignore
            tableroHTML.style.background = 'red';
            this.inGame = false;
            Swal.fire({
              title: 'Perdiste',
              text: 'Mejor suerte la próxima',
              icon: 'error',
              confirmButtonText: 'Volver a intentar',
              confirmButtonColor: '#3085d6',
              showClass: {
                popup: 'animate__animated animate__fadeInDown'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
              }
            }).then(() => {
              this.newGame();
            });
          }
        }
      }
    }
    if (this.inGame){
      return
    }
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        // @ts-ignore
        if (this.tablero[c][r].value == -1) {
          let celda = document.getElementById('celda-'+c+'-'+r);
          // @ts-ignore
          celda.innerHTML = '<i class="fas fa-bomb fa-lg"></i>';
          // @ts-ignore
          celda.style.color = 'black';
        }
      }
    }
  }

  openArea(c: any, r: any): void {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i == 0 && j == 0) {
          continue;
        }
        try {
          // @ts-ignore
          if (this.tablero[c+i][r+j].state != 'show'){
            // @ts-ignore
            if (this.tablero[c+i][r+j].state != 'marked'){
              // @ts-ignore
              this.tablero[c+i][r+j].state = 'show';
              // @ts-ignore
              if (this.tablero[c+i][r+j].value == 0) {
                this.openArea(c+i, r+j);
              }
            }
          }
        } catch (e) {

        }
      }
    }
  }
}
