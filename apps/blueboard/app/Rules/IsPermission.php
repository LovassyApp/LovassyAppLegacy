<?php

namespace App\Rules;

use App\Helpers\Warden\Services\Warden;
use Illuminate\Contracts\Validation\Rule;

class IsPermission implements Rule
{
    private string $exceptionMessage;
    private Warden $permissionManager;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(Warden $permissionManager)
    {
        $this->exceptionMessage = '';
        $this->permissionManager = $permissionManager;
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

            $this->permissionManager->validatePermissions($arr);
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
