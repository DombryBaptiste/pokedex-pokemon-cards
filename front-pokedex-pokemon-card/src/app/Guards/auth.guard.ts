import { inject } from "@angular/core"
import { AuthService } from "../Services/auth.service"
import { Router } from "@angular/router";

export const AuthGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router)

    if(authService.getToken === null)
    {
        router.navigateByUrl('/');
        return false;
    }
    return true;
}