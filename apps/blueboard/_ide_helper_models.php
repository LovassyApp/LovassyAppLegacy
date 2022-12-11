<?php

// @formatter:off
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Helpers\LibRefresh\Models{
/**
 * App\Helpers\LibRefresh\Models\RefreshMetadata
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $password_encrypted
 * @property int $metadata_owner_id
 * @property string $metadata_owner_type
 * @property string $salt
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshMetadata newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshMetadata newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshMetadata query()
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshMetadata whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshMetadata whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshMetadata whereMetadataOwnerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshMetadata whereMetadataOwnerType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshMetadata wherePasswordEncrypted($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshMetadata whereSalt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshMetadata whereUpdatedAt($value)
 */
	class RefreshMetadata extends \Eloquent {}
}

namespace App\Helpers\LibRefresh\Models{
/**
 * App\Helpers\LibRefresh\Models\RefreshToken
 *
 * @property int $id
 * @property int $expires_at
 * @property string $token
 * @property string $name
 * @property int $refreshable_id
 * @property string $refreshable_type
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Helpers\LibRefresh\Models\RefreshMetadata|null $metadata
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent $refreshable
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshToken newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshToken newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshToken query()
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshToken whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshToken whereExpiresAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshToken whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshToken whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshToken whereRefreshableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshToken whereRefreshableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshToken whereToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshToken whereUpdatedAt($value)
 */
	class RefreshToken extends \Eloquent {}
}

namespace App\Helpers\SacroSanctum\Models{
/**
 * RefreshToken - For regenerating expired tokens
 *
 * @property int $id
 * @property int $expires_at
 * @property string $token
 * @property string $name
 * @property int $refreshable_id
 * @property string $refreshable_type
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent $refreshable
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshToken newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshToken newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshToken query()
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshToken whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshToken whereExpiresAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshToken whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshToken whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshToken whereRefreshableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshToken whereRefreshableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshToken whereToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RefreshToken whereUpdatedAt($value)
 */
	class RefreshToken extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Grade
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $user_id
 * @property string|null $lolo_id
 * @property string $uid
 * @property string $subject
 * @property string $subject_category
 * @property string $teacher
 * @property string $group
 * @property int $grade
 * @property string $textGrade
 * @property string $shortTextGrade
 * @property int $weight
 * @property string $date
 * @property string $create_date
 * @property string $name
 * @property string $type
 * @property string $gradeType
 * @property int $evaluationType
 * @property string $evaluationTypeDescription
 * @method static \Illuminate\Database\Eloquent\Builder|Grade newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Grade newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Grade query()
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereCreateDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereEvaluationType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereEvaluationTypeDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereGrade($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereGradeType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereGroup($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereLoloId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereShortTextGrade($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereSubject($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Grade whereSubjectCategory($value)
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
 * App\Models\GradeImport
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $user_id
 * @property string $encryption_key
 * @property string $json_encrypted
 * @method static \Illuminate\Database\Eloquent\Builder|GradeImport newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|GradeImport newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|GradeImport query()
 * @method static \Illuminate\Database\Eloquent\Builder|GradeImport whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GradeImport whereEncryptionKey($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GradeImport whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GradeImport whereJsonEncrypted($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GradeImport whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GradeImport whereUserId($value)
 */
	class GradeImport extends \Eloquent {}
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
 * @property-read \App\Models\ItemUse|null $itemUse
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
 * App\Models\ItemUse
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property mixed $values
 * @property int $product_id
 * @property int $item_id
 * @method static \Illuminate\Database\Eloquent\Builder|ItemUse newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ItemUse newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ItemUse query()
 * @method static \Illuminate\Database\Eloquent\Builder|ItemUse whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ItemUse whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ItemUse whereItemId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ItemUse whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ItemUse whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ItemUse whereValues($value)
 */
	class ItemUse extends \Eloquent {}
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
 * @property-read mixed $hash
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
 * App\Models\LoloRequest
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $body
 * @property string $title
 * @property int $user_id
 * @property string|null $accepted_at
 * @property string|null $denied_at
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder|LoloRequest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|LoloRequest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|LoloRequest query()
 * @method static \Illuminate\Database\Eloquent\Builder|LoloRequest whereAcceptedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LoloRequest whereBody($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LoloRequest whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LoloRequest whereDeniedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LoloRequest whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LoloRequest whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LoloRequest whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LoloRequest whereUserId($value)
 */
	class LoloRequest extends \Eloquent {}
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
 * @property string $notified_mails
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\QRCode[] $codes
 * @property-read int|null $codes_count
 * @property-read mixed $code_names
 * @property-read mixed $image_url
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\InventoryItem[] $items
 * @property-read int|null $items_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\UserGroup[] $notifiedGroups
 * @property-read int|null $notified_groups_count
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
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereNotifiedMails($value)
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
 * @property string $email
 * @property-read mixed $image
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Product[] $products
 * @property-read int|null $products_count
 * @method static \Illuminate\Database\Eloquent\Builder|QRCode newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|QRCode newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|QRCode query()
 * @method static \Illuminate\Database\Eloquent\Builder|QRCode whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QRCode whereEmail($value)
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
 * @property string $name
 * @property string $email
 * @property string $password
 * @property string $public_key_hex
 * @property string $private_key_encrypted
 * @property string $master_key_encrypted
 * @property string $om_code_encrypted
 * @property string $om_code_hashed
 * @property string|null $class
 * @property int $import_available
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $balance
 * @property-read mixed $hash
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Grade[] $grades
 * @property-read int|null $grades_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\UserGroup[] $groups
 * @property-read int|null $groups_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\GradeImport[] $imports
 * @property-read int|null $imports_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\InventoryItem[] $items
 * @property-read int|null $items_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Lolo[] $lolo
 * @property-read int|null $lolo_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection|\Illuminate\Notifications\DatabaseNotification[] $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Helpers\LibRefresh\Models\RefreshToken[] $refreshTokens
 * @property-read int|null $refresh_tokens_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\LoloRequest[] $requests
 * @property-read int|null $requests_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\Laravel\Sanctum\PersonalAccessToken[] $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\UserFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 * @method static \Illuminate\Database\Eloquent\Builder|User whereClass($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereImportAvailable($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereMasterKeyEncrypted($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereOmCodeEncrypted($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereOmCodeHashed($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePrivateKeyEncrypted($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePublicKeyHex($value)
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
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\User[] $users
 * @property-read int|null $users_count
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

