<?php

// @formatter:off
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * App\Models\Grade
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $user_id
 * @property int|null $lolo_id
 * @property string $uid
 * @property string $bounds
 * @property string $subject
 * @property string $teacher
 * @property int $grade
 * @property string $textGrade
 * @property string $shortTextGrade
 * @property int $weight
 * @property string $date
 * @property string $name
 * @property string $type
 * @property string $gradeType
 * @property int $evaluationType
 * @property string $evaluationTypeDescription
 * @method static \Illuminate\Database\Eloquent\Builder|Grade newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Grade newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Grade query()
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereBounds($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereEvaluationType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereEvaluationTypeDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereGrade($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereGradeType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereLoloId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereShortTextGrade($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereSubject($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereTeacher($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereTextGrade($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereUid($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereWeight($value)
 */
	class Grade extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\InventoryItem
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $product_id
 * @property int $history_id
 * @property int $user_id
 * @property string|null $used_at
 * @property-read \App\Models\Product|null $product
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem query()
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereHistoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereUsedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereUserId($value)
 */
	class InventoryItem extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\KretaCred
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $user_id
 * @property string $username
 * @property string $password
 * @property string|null $token
 * @property string|null $refreshToken
 * @method static \Illuminate\Database\Eloquent\Builder|KretaCred newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|KretaCred newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|KretaCred query()
 * @method static \Illuminate\Database\Eloquent\Builder|KretaCred whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|KretaCred whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|KretaCred wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|KretaCred whereRefreshToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|KretaCred whereToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|KretaCred whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|KretaCred whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|KretaCred whereUsername($value)
 */
	class KretaCred extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Lolo
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $user_id
 * @property int|null $history_id
 * @property int $isSpent
 * @property mixed $reason
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Grade[] $grades
 * @property-read int|null $grades_count
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder|Lolo newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Lolo newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Lolo query()
 * @method static \Illuminate\Database\Eloquent\Builder|Lolo whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Lolo whereHistoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Lolo whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Lolo whereIsSpent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Lolo whereReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Lolo whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Lolo whereUserId($value)
 */
	class Lolo extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\PersonalAccessToken
 *
 * @property int $id
 * @property string $tokenable_type
 * @property int $tokenable_id
 * @property string $name
 * @property string $token
 * @property array|null $abilities
 * @property \Illuminate\Support\Carbon|null $last_used_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent $tokenable
 * @method static \Illuminate\Database\Eloquent\Builder|PersonalAccessToken newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PersonalAccessToken newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PersonalAccessToken query()
 * @method static \Illuminate\Database\Eloquent\Builder|PersonalAccessToken whereAbilities($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PersonalAccessToken whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PersonalAccessToken whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PersonalAccessToken whereLastUsedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PersonalAccessToken whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PersonalAccessToken whereToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PersonalAccessToken whereTokenableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PersonalAccessToken whereTokenableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PersonalAccessToken whereUpdatedAt($value)
 */
	class PersonalAccessToken extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Product
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $name
 * @property string $description
 * @property string $markdownContent
 * @property int $codeActivated
 * @property int $price
 * @property int $quantity
 * @property mixed $inputs
 * @property string $imageName
 * @property int $visible
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\QRCode[] $codes
 * @property-read int|null $codes_count
 * @property-read mixed $code_names
 * @property-read mixed $image_url
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\InventoryItem[] $items
 * @property-read int|null $items_count
 * @method static \Illuminate\Database\Eloquent\Builder|Product newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Product newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Product query()
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereCodeActivated($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereImageName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereInputs($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereMarkdownContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereVisible($value)
 */
	class Product extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\QRCode
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $secret
 * @property string $name
 * @property-read mixed $image
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Product[] $products
 * @property-read int|null $products_count
 * @method static \Illuminate\Database\Eloquent\Builder|QRCode newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|QRCode newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|QRCode query()
 * @method static \Illuminate\Database\Eloquent\Builder|QRCode whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QRCode whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QRCode whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QRCode whereSecret($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QRCode whereUpdatedAt($value)
 */
	class QRCode extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Salt
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $value
 * @property int $user_id
 * @method static \Illuminate\Database\Eloquent\Builder|Salt newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Salt newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Salt query()
 * @method static \Illuminate\Database\Eloquent\Builder|Salt whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Salt whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Salt whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Salt whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Salt whereValue($value)
 */
	class Salt extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\StoreHistory
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property mixed $reason
 * @property int $product_id
 * @property int|null $item_id
 * @property int $user_id
 * @method static \Illuminate\Database\Eloquent\Builder|StoreHistory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StoreHistory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StoreHistory query()
 * @method static \Illuminate\Database\Eloquent\Builder|StoreHistory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StoreHistory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StoreHistory whereItemId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StoreHistory whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StoreHistory whereReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StoreHistory whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StoreHistory whereUserId($value)
 */
	class StoreHistory extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\User
 *
 * @property int $id
 * @property string|null $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $balance
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\UserGroup[] $groups
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Grade[] $grades
 * @property-read int|null $grades_count
 * @property-read int|null $groups_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\InventoryItem[] $items
 * @property-read int|null $items_count
 * @property-read \App\Models\KretaCred|null $kreta
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Lolo[] $lolo
 * @property-read int|null $lolo_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection|\Illuminate\Notifications\DatabaseNotification[] $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\Laravel\Sanctum\PersonalAccessToken[] $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\UserFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUpdatedAt($value)
 */
	class User extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\UserGroup
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $name
 * @property mixed $permissions
 * @method static \Illuminate\Database\Eloquent\Builder|UserGroup newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserGroup newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserGroup query()
 * @method static \Illuminate\Database\Eloquent\Builder|UserGroup whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserGroup whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserGroup whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserGroup wherePermissions($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserGroup whereUpdatedAt($value)
 */
	class UserGroup extends \Eloquent {}
}

