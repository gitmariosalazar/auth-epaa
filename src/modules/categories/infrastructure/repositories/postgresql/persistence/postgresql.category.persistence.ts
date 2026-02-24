import { Injectable } from '@nestjs/common';
import { DatabaseServicePostgreSQL } from '../../../../../../shared/connections/database/postgresql/postgresql.service';
import { InterfaceCategoryRepository } from '../../../../domain/contracts/category.interface.repository';
import { CategoryResponse } from '../../../../domain/schemas/dto/response/category.response';
import { CategoryModel } from '../../../../domain/schemas/models/category.model';
import { CategorySqlResponse } from '../../../interfaces/sql/category.sql.response';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';
import { CategoryPostgreSqlAdapter } from '../adapters/category.adapter';
import { Exists } from '../../../../../../shared/interfaces/verify-exists';

@Injectable()
export class CategoryPostgreSQLPersistence implements InterfaceCategoryRepository {
  // Implement repository methods here
  constructor(private readonly postgreSQLService: DatabaseServicePostgreSQL) {}

  async createCategory(
    category: CategoryModel,
  ): Promise<CategoryResponse | null> {
    try {
      const query: string = `
        INSERT INTO permiso_categoria (nombre, descripcion, activo)
        VALUES ($1, $2, $3)
        RETURNING categoria_id AS "category_id",
                  nombre AS "category_name",
                  descripcion AS "category_description",
                  activo AS "is_active";
      `;
      const params = [
        category.getName(),
        category.getDescription() || null,
        category.getActiveStatus(),
      ];

      const result = await this.postgreSQLService.query<CategorySqlResponse>(
        query,
        params,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: `Failed to create category`,
        });
      }

      const createdCategory: CategoryResponse =
        CategoryPostgreSqlAdapter.fromCategorySqlResponseToCategoryResponse(
          result[0],
        );

      return createdCategory;
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(
    categoryId: number,
    category: CategoryModel,
  ): Promise<CategoryResponse | null> {
    try {
      const query: string = `
        UPDATE permiso_categoria
        SET nombre = $1,
            descripcion = $2,
            activo = $3
        WHERE categoria_id = $4
        RETURNING categoria_id AS "category_id",
                  nombre AS "category_name",
                  descripcion AS "category_description",
                  activo AS "is_active";
      `;
      const params = [
        category.getName(),
        category.getDescription() || null,
        category.getActiveStatus(),
        categoryId,
      ];

      const result = await this.postgreSQLService.query<CategorySqlResponse>(
        query,
        params,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Category with ID ${categoryId} not found`,
        });
      }

      const updatedCategory: CategoryResponse =
        CategoryPostgreSqlAdapter.fromCategorySqlResponseToCategoryResponse(
          result[0],
        );

      return updatedCategory;
    } catch (error) {
      throw error;
    }
  }

  async getCategoryById(categoryId: number): Promise<CategoryResponse | null> {
    try {
      const query: string = `
        SELECT 
          categoria_id AS "category_id",
          nombre AS "category_name",
          descripcion AS "category_description",
          activo AS "is_active"
        FROM permiso_categoria
        WHERE categoria_id = $1;
      `;
      const params = [categoryId];

      const result = await this.postgreSQLService.query<CategorySqlResponse>(
        query,
        params,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Category with ID ${categoryId} not found`,
        });
      }

      const category: CategoryResponse =
        CategoryPostgreSqlAdapter.fromCategorySqlResponseToCategoryResponse(
          result[0],
        );

      return category;
    } catch (error) {
      throw error;
    }
  }

  async getAllCategories(
    limit: number,
    offset: number,
  ): Promise<CategoryResponse[]> {
    try {
      const query: string = `
        SELECT 
          categoria_id AS "category_id",
          nombre AS "category_name",
          descripcion AS "category_description",
          activo AS "is_active"
        FROM permiso_categoria
        ORDER BY categoria_id
        LIMIT $1 OFFSET $2;
      `;
      const params = [limit, offset];

      const result = await this.postgreSQLService.query<CategorySqlResponse>(
        query,
        params,
      );

      const categories: CategoryResponse[] = result.map((categorySql) =>
        CategoryPostgreSqlAdapter.fromCategorySqlResponseToCategoryResponse(
          categorySql,
        ),
      );

      return categories;
    } catch (error) {
      throw error;
    }
  }

  async verifyCategoryExistsByName(categoryName: string): Promise<boolean> {
    try {
      const query: string = `
        SELECT EXISTS (
          SELECT 1
          FROM permiso_categoria
          WHERE nombre = $1
        );
      `;
      const params = [categoryName];

      const result = await this.postgreSQLService.query<Exists>(query, params);

      return result[0].exists;
    } catch (error) {
      throw error;
    }
  }

  async deleteCategory(categoryId: number): Promise<boolean> {
    try {
      const query: string = `
        DELETE FROM permiso_categoria
        WHERE categoria_id = $1;
      `;
      const params: number[] = [categoryId];

      const result = await this.postgreSQLService.query(query, params);
      console.log('Delete result Pers:', result);
      return result.length > 0;
    } catch (error) {
      throw error;
    }
  }

  async searchCategoryByName(term: string): Promise<CategoryResponse[]> {
    try {
      const query: string = `
        SELECT 
          categoria_id AS "category_id",
          nombre AS "category_name",
          descripcion AS "category_description",
          activo AS "is_active"
        FROM permiso_categoria
        WHERE nombre ILIKE $1;
      `;
      const params = [`%${term}%`];

      const result = await this.postgreSQLService.query<CategorySqlResponse>(
        query,
        params,
      );

      return result.map((categorySql) =>
        CategoryPostgreSqlAdapter.fromCategorySqlResponseToCategoryResponse(
          categorySql,
        ),
      );
    } catch (error) {
      throw error;
    }
  }
}
