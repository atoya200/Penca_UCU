import { Component, OnInit, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrarService } from '../registrar.service';
import { NgIf, NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.css'
})

export class RegistrarComponent {

  angForm: FormGroup;
  Career: any;
  constructor(private fb: FormBuilder, private service: RegistrarService, private router: Router) { }


  ngOnInit(): void {
    // traer carreras de la base de datos y cargarla a "carreras"
    this.angForm = this.fb.group({
      ci: ['', [Validators.required, Validators.minLength(7), Validators.pattern('^[0-9]*$')]],
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      carrera: ['', Validators.required],
      password: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9A-Z._%+-]+@[a-z0-9A-Z.-]+.[a-zA-Z]{2,4}$')]],
    });

    // buscar carreras
    this.buscarCarreras()

  }


  buscarCarreras() {
    this.service.getCareers().subscribe(
      data => {
        this.Career = (data as any).career;
        console.log(this.Career)
      },
      error => {
        this.Career = [];
        alert(error.error.msg)
        console.log(error);
      });
  }

  registrar(): void {
    this.service.register(this.angForm.get('ci').value,
      this.angForm.get('name').value,
      this.angForm.get('lastname').value,
      this.angForm.get('password').value,
      this.angForm.get('email').value,
      this.angForm.get('carrera').value).subscribe(
        data => {
          alert("Usuario registrado con éxito.")
          this.volver()
        },
        error => {
          alert(error.error.msg)
          console.log(error);
        });

  }

  volver(): void {
    this.router.navigate(['/login']);
  }

}
