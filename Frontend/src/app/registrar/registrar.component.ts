import { Component, OnInit, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrarService } from '../registrar.service';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.css'
})

export class RegistrarComponent {

  angForm: FormGroup;
  constructor(private fb: FormBuilder, private service: RegistrarService, private router: Router) { }


  ngOnInit(): void {
    // traer carreras de la base de datos y cargarla a "carreras"
    this.angForm = this.fb.group({
      ci: ['', [Validators.required, Validators.minLength(7), Validators.pattern('^[0-9]*$')]],
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      carrera: '',//required?
      password: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9A-Z._%+-]+@[a-z0-9A-Z.-]+.[a-zA-Z]{2,4}$')]],
    });
  }

  enviarFormulario(): void {
    this.router.navigate(['/menu']);
  }

  volver(): void {
    this.router.navigate(['/login']);
  }

}
