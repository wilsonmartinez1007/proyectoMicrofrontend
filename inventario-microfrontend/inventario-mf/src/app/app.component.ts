import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ComprasService,
  Compra,
} from './compras.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'inventario-mf';

  isAuthenticated = false;
  
  compras: Compra[] = [];
  loading = false;
  error: string | null = null;

  // formulario
  codigo = '';
  nombre = '';
  precio: number | null = null;
  cantidad: number | null = null;

  // edición
  editId: number | null = null;

  ESTADOS = ['PENDIENTE', 'PAGADA', 'CANCELADA'];
  
  //para filtros  
  filtroEstado: string = 'TODOS';

  constructor(private comprasService: ComprasService) {}



  ngOnInit(): void {

    const token = localStorage.getItem('access_token');

    if (!token) {
      // No hay sesión → mandar al login
      window.history.pushState(null, '', '/login');
      return;
    }

    
    this.isAuthenticated = true;
    // Si hay token, cargamos las compras
    this.cargarCompras();
  }

  //filtros
  get comprasFiltradas(): Compra[] {
    if (this.filtroEstado === 'TODOS') {
      return this.compras;
    }
    return this.compras.filter((c) => c.estado === this.filtroEstado);
}

  cargarCompras(): void {
    this.loading = true;
    this.error = null;

    this.comprasService.getCompras().subscribe({
      next: (data) => {
        this.compras = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);

        // para sesión inválida 
        if (err.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.history.pushState(null, '', '/login');
          return;
        }

        this.error = 'Error al cargar las compras';
        this.loading = false;
      },
    });
  }


  resetForm(): void {
    this.codigo = '';
    this.nombre = '';
    this.precio = null;
    this.cantidad = null;
    this.editId = null;
  }

  onSubmit(): void {
    this.error = null;

    if (!this.codigo || !this.nombre || this.precio == null || this.cantidad == null) {
      this.error = 'Todos los campos son obligatorios';
      return;
    }

    const data = {
      codigo: this.codigo,
      nombre: this.nombre,
      precio: this.precio,
      cantidad: this.cantidad,
    };

    if (this.editId === null) {
      // crear
      this.comprasService.crearCompra(data).subscribe({
        next: () => {
          this.resetForm();
          this.cargarCompras();
        },
        error: (err) => {
          console.error(err);
          this.error = 'Error al crear la compra';
        },
      });
    } else {
      // actualizar
      this.comprasService.actualizarCompra(this.editId, data).subscribe({
        next: () => {
          this.resetForm();
          this.cargarCompras();
        },
        error: (err) => {
          console.error(err);
          this.error = 'Error al actualizar la compra';
        },
      });
    }
  }

  editar(compra: Compra): void {
    this.codigo = compra.codigo;
    this.nombre = compra.nombre;
    this.precio = compra.precio;
    this.cantidad = compra.cantidad;
    this.editId = compra.id;
  }

  cancelarEdicion(): void {
    this.resetForm();
  }

  eliminar(id: number): void {
    if (!confirm('¿Seguro que quieres eliminar esta compra?')) return;

    this.comprasService.eliminarCompra(id).subscribe({
      next: () => this.cargarCompras(),
      error: (err) => {
        console.error(err);
        this.error = 'Error al eliminar la compra';
      },
    });
  }

  cambiarEstado(compra: Compra, nuevoEstado: string): void {
    this.comprasService.cambiarEstado(compra.id, nuevoEstado).subscribe({
      next: () => this.cargarCompras(),
      error: (err) => {
        console.error(err);
        this.error = 'Error al cambiar el estado';
      },
    });
  }
}
