import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn } from 'typeorm'

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ type: 'varchar', length: 42, nullable: false })
  @Index({ unique: true })
  login: string

  @Column({ type: 'varchar', nullable: false })
  password: string

  @Column({ type: 'varchar', nullable: false })
  salt: string

  @Column({ type: 'boolean', nullable: false, default: false })
  isAdmin: boolean

  @CreateDateColumn()
  createdAt: Date
}
