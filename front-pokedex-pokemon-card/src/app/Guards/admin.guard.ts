import { inject } from "@angular/core"
import { AuthService } from "../Services/auth.service"
import { Role } from "../Models/userConnect";

export const AdminGuard = () => {
    const authService = inject(AuthService);
    const user = authService.user$.getValue();

    return user?.role === Role.Admin;
}