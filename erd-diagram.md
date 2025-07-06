# Inventory Management System - ERD Diagram

## Entity Relationship Diagram

```mermaid
erDiagram
    Supplier {
        uuid id PK
        varchar(100) name
        varchar(100) contact_email
        timestamp created_at
    }
    
    Products {
        uuid id PK
        varchar(100) name
        text description
        boolean in_stock
        int quantity
        decimal(10,2) price
        timestamp created_at
        uuid supplier_id FK
    }
    
    StockLog {
        uuid id PK
        int change
        varchar(255) reason
        timestamp logged_at
        uuid product_id FK
    }
    
    Supplier ||--o{ Products : "supplies"
    Products ||--o{ StockLog : "tracks_changes"
    
    %% Constraints
    Products {
        CHECK price > 0
        CHECK quantity >= 0
    }
```

## Relationships

1. **Supplier to Products**: One-to-Many
   - One supplier can supply multiple products
   - Each product belongs to exactly one supplier
   - Cascade delete: When a supplier is deleted, all their products are deleted

2. **Products to StockLog**: One-to-Many
   - One product can have multiple stock log entries
   - Each stock log entry belongs to exactly one product
   - Cascade delete: When a product is deleted, all its stock logs are deleted

## Key Features

- **UUID Primary Keys**: All entities use UUID as primary keys for better scalability
- **Audit Fields**: Created timestamps for tracking when records were created
- **Data Validation**: Check constraints ensure price > 0 and quantity >= 0
- **Referential Integrity**: Foreign key relationships with cascade delete options
- **Stock Tracking**: StockLog entity tracks all quantity changes with reasons

## Database Schema Summary

| Entity | Purpose | Key Relationships |
|--------|---------|-------------------|
| Supplier | Manages supplier information | Supplies multiple products |
| Products | Manages product inventory | Belongs to one supplier, has multiple stock logs |
| StockLog | Tracks inventory changes | Belongs to one product | 