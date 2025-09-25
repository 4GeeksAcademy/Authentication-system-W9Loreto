from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

# --- Association table (M-N) ---
users_courses = db.Table(
    "users_courses",
    db.Model.metadata,
    db.Column("users_id", Integer, db.ForeignKey(
        "users.id"), primary_key=True),
    db.Column("courses_id", Integer, db.ForeignKey(
        "courses.id"), primary_key=True),
)


class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(200), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(200), nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=True)

    profile: Mapped["Profile"] = relationship(
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )

    todos: Mapped[list["Task"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )

    courses: Mapped[list["Course"]] = relationship(
        secondary=users_courses,
        back_populates="users",
    )

    def serialize(self) -> dict:
        return {
            "id": self.id,
            "email": self.email,
            "password": self.password
        }

    def serialize_complete_info(self) -> dict:
        return {
            "id": self.id,
            "email": self.email,
            "profile": {
                "bio": self.profile.bio,
                "github": self.profile.github,
            } if self.profile else None,
            "todos": [task.serialize() for task in self.todos],
            "courses": [course.serialize() for course in self.courses],
        }


class Profile(db.Model):
    __tablename__ = "profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    bio: Mapped[str] = mapped_column(Text(), default="")
    github: Mapped[str] = mapped_column(String(100), default="")
    users_id: Mapped[int] = mapped_column(
        db.ForeignKey("users.id"), nullable=False)

    user: Mapped["User"] = relationship(back_populates="profile")

    def serialize(self) -> dict:
        return {
            "id": self.id,
            "bio": self.bio,
            "github": self.github,
        }


class Course(db.Model):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)

    users: Mapped[list["User"]] = relationship(
        secondary=users_courses,
        back_populates="courses",
    )

    def serialize(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
        }


class Task(db.Model):
    __tablename__ = "todos"

    id: Mapped[int] = mapped_column(primary_key=True)
    label: Mapped[str] = mapped_column(String(200), nullable=False)
    done: Mapped[bool] = mapped_column(Boolean(), default=False)
    users_id: Mapped[int] = mapped_column(
        db.ForeignKey("users.id"), nullable=False)

    user: Mapped["User"] = relationship(back_populates="todos")

    def serialize(self) -> dict:
        return {
            "id": self.id,
            "label": self.label,
            "done": self.done,
        }
