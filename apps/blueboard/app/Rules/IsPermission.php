<?php

namespace App\Rules;

use App\Helpers\PermissionManager\PermissionHelper;
use Illuminate\Contracts\Validation\Rule;

class IsPermission implements Rule
{
    private string $exceptionMessage;
    private PermissionHelper $permissionHelper;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(PermissionHelper $permissionHelper)
    {
        $this->exceptionMessage = '';
        $this->permissionHelper = $permissionHelper;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        try {
            $arr = $value;
            if (!is_array($arr)) {
                $arr = [$arr];
            }

            $this->permissionHelper->validatePermissions($arr);
        } catch (\Exception $exception) {
            $this->exceptionMessage = $exception->getMessage();
            return false;
        }

        return true;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return $this->exceptionMessage;
    }
}
