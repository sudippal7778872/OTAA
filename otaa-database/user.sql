use otaa;
CREATE TABLE User
    (
        UserPID             bigint Primary Key auto_increment,
        UserName            nvarchar(250) not null,
        Password            nvarchar(250) not null,
        FullName            nvarchar(50) not null,
        Email                nvarchar(100) not null,
        Photo                varchar(200),
        Role                 varchar(50) not null,
        Active                bit not null default false,
        Organization        nvarchar(100) not null,
        PasswordResetKey     nvarchar(100),
        LastLogin            datetime,
        LastLogout            datetime,
        CreatedAt datetime default CURRENT_TIMESTAMP(),
        UpdatedAt            nvarchar(50),
        unique(UserName)
    );